from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status, Body
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from jose import jwt, JWTError
from pydantic import BaseModel

from app import schemas
from app.auth import security
from app.core.config import settings
from app.auth.deps import get_db
from app.models.user import User, Role
from app.models.profile import StudentProfile, ClientProfile
from app.models.core import Domain, Level
from app.models.learning import Assignment, StudentProgress

router = APIRouter()

class RefreshTokenRequest(BaseModel):
    refresh_token: str

@router.post("/register", response_model=schemas.Token)
def register(
    request: schemas.RegisterRequest,
    db: Session = Depends(get_db)
) -> Any:
    """
    Register a new user and create their profile. Returns access token.
    """
    user = db.query(User).filter(User.email == request.email).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system",
        )
    
    role = db.query(Role).filter(Role.role_name.ilike(request.role)).first()
    if not role:
        raise HTTPException(status_code=400, detail="Invalid role specified")
        
    new_user = User(
        email=request.email,
        password_hash=security.get_password_hash(request.password),
        first_name=request.first_name,
        last_name=request.last_name,
        role_id=role.role_id,
        is_active=True
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    if request.role.lower() == 'student':
        level_d = db.query(Level).filter(Level.name == "Level D").first()
        profile = StudentProfile(
            user_id=new_user.user_id,
            level_id=level_d.level_id if level_d else None,
            trust_score=0.0
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)
        
        # Initialize student progress dynamically
        assignments = db.query(Assignment).all()
        for assignment in assignments:
            progress = StudentProgress(
                student_id=profile.profile_id,
                item_id=assignment.assignment_id,
                item_type="Assignment",
                status="NOT_STARTED"
            )
            db.add(progress)
        
    elif request.role.lower() == 'client':
        domain = db.query(Domain).filter(Domain.name.ilike(f"%{request.domain}%")).first() if request.domain else None
        profile = ClientProfile(
            user_id=new_user.user_id,
            company_name=request.company_name or "Unknown Company",
            domain_id=domain.domain_id if domain else None
        )
        db.add(profile)
        
    db.commit()
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    refresh_token_expires = timedelta(minutes=settings.REFRESH_TOKEN_EXPIRE_MINUTES)
    
    return {
        "access_token": security.create_access_token(
            new_user.user_id, expires_delta=access_token_expires
        ),
        "refresh_token": security.create_refresh_token(
            new_user.user_id, expires_delta=refresh_token_expires
        ),
        "token_type": "bearer",
    }

@router.post("/login", response_model=schemas.Token)
def login_access_token(
    db: Session = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 compatible token login, get an access token and refresh token for future requests
    """
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not security.verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    elif not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    refresh_token_expires = timedelta(minutes=settings.REFRESH_TOKEN_EXPIRE_MINUTES)
    
    return {
        "access_token": security.create_access_token(
            user.user_id, expires_delta=access_token_expires
        ),
        "refresh_token": security.create_refresh_token(
            user.user_id, expires_delta=refresh_token_expires
        ),
        "token_type": "bearer",
    }


@router.post("/refresh", response_model=schemas.Token)
def refresh_token(
    request: RefreshTokenRequest,
    db: Session = Depends(get_db)
) -> Any:
    """
    Get a new access token and refresh token pair using a valid refresh token.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
    )
    try:
        payload = jwt.decode(
            request.refresh_token, settings.SECRET_KEY, algorithms=[security.ALGORITHM]
        )
        user_id: str = payload.get("sub")
        token_type: str = payload.get("type")
        
        if user_id is None or token_type != "refresh":
            raise credentials_exception
            
    except JWTError:
        raise credentials_exception
        
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
        
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    refresh_token_expires = timedelta(minutes=settings.REFRESH_TOKEN_EXPIRE_MINUTES)
    
    return {
        "access_token": security.create_access_token(
            user.user_id, expires_delta=access_token_expires
        ),
        "refresh_token": security.create_refresh_token(
            user.user_id, expires_delta=refresh_token_expires
        ),
        "token_type": "bearer",
    }

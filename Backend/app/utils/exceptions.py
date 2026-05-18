from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from app.utils.responses import error_response

async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    simplified_errors = [{"loc": err.get("loc"), "msg": err.get("msg")} for err in errors]
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=error_response(message="Validation Error", data=simplified_errors).model_dump()
    )

async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content=error_response(message=str(exc.detail)).model_dump()
    )

async def global_exception_handler(request: Request, exc: Exception):
    # In production, do not expose raw exception strings to the client for security reasons
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=error_response(message="Internal Server Error", data=str(exc)).model_dump()
    )

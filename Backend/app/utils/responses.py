from typing import Any, Generic, TypeVar, Optional
from pydantic import BaseModel

T = TypeVar("T")

class StandardResponse(BaseModel, Generic[T]):
    success: bool = True
    message: str = "Success"
    data: Optional[T] = None

def success_response(data: Any = None, message: str = "Success") -> StandardResponse:
    return StandardResponse(success=True, message=message, data=data)

def error_response(message: str, data: Any = None) -> StandardResponse:
    return StandardResponse(success=False, message=message, data=data)

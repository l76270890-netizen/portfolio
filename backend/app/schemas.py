from typing import Annotated, Any

from pydantic import BaseModel, EmailStr, Field, StringConstraints


class SiteContentPayload(BaseModel):
    navigation: dict[str, Any]
    hero: dict[str, Any]
    about: dict[str, Any]
    services: dict[str, Any]
    skills: dict[str, Any]
    projects: dict[str, Any]
    contact: dict[str, Any]


class ContactMessageIn(BaseModel):
    firstName: Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=100)]
    lastName: Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=100)]
    email: EmailStr
    phone: Annotated[str, StringConstraints(strip_whitespace=True, max_length=40)] | None = None
    message: Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=5000)]


class AdminLoginIn(BaseModel):
    password: Annotated[str, StringConstraints(min_length=1, max_length=256)]


class ImageUploadIn(BaseModel):
    filename: Annotated[str, StringConstraints(min_length=1, max_length=200)]
    data: Annotated[str, Field(max_length=4_194_304)]

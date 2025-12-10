from fastapi import FastAPI

PROJECT_NAME = "AeroDocAssistant"

app = FastAPI(title=f"{PROJECT_NAME}")


@app.get("/",
         summary="Статус API",
         description="Проверка работы API",
         response_description=f'Возвращает {PROJECT_NAME} работает!"'
         )
async def root():
    return {"message": f"{PROJECT_NAME} работает!"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8080, reload=True)

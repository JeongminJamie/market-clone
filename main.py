from fastapi import FastAPI, UploadFile, Form, Response
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from fastapi.staticfiles import StaticFiles 
from typing import Annotated
import sqlite3

# db connection
con = sqlite3.connect('db.db', check_same_thread=False)
cur = con.cursor() 

app = FastAPI()

@app.post("/items")
# Form 형식으로 받을 거라서, annotated 안에 그 key에 대한 값과 Form()을 함께 기입
async def create_item(image:UploadFile, 
                title:Annotated[str, Form()], 
                price:Annotated[int, Form()], 
                description:Annotated[str, Form()], 
                place:Annotated[str, Form()],
                insertAt:Annotated[int, Form()]):
  # 이미지를 읽는 시간
  image_bytes = await image.read() 
  # 파이썬 버전의 변수명 "" 안에 넣는 법 = f""
  # VALUES 안에는 테이블 컬럼 순서대로 기입해주기 
  cur.execute(f"""
              INSERT INTO items(title, image, price, description, place, insertAt) VALUES ('{title}', '{image_bytes.hex()}', {price}, '{description}', '{place}', {insertAt})
              """)
  con.commit()
  return '200'

@app.get("/items")
async def get_items():
  #컬럼명도 데이터와 함께 가져옴
  con.row_factory = sqlite3.Row
  
  # db를 가져오면서 db의 위치 업데이트 
  cur = con.cursor()
  rows = cur.execute(f"""
                     SELECT * FROM items 
                     """).fetchall()
  return JSONResponse(jsonable_encoder(dict(row) for row in rows))

@app.get("/images/{item_id}")
async def get_image(item_id):
  cur = con.cursor()
  
  # 16진법으로 되어있는 image 부르기
  image_bytes = cur.execute(f"""
                            SELECT image from items WHERE id={item_id}
                            """).fetchone()[0]
  # 16진법의 image를 blob인 이진법 형태로 바꾸기 with .fromhex()
  # 하나의 데이터만 필요하기에, json 형식이 아닌 response로 보내준다: 이 같은 경우는 blob 형태로 보내줌 
  return Response(content=bytes.fromhex(image_bytes))

app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")
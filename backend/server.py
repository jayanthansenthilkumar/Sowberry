import os
import subprocess
import signal
import time
import httpx
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

EXPRESS_PORT = 5555
EXPRESS_URL = f"http://127.0.0.1:{EXPRESS_PORT}"
express_process = None


def start_express():
    global express_process
    env = os.environ.copy()
    env["PORT"] = str(EXPRESS_PORT)
    express_process = subprocess.Popen(
        ["node", "server.js"],
        cwd="/app/server",
        env=env,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    time.sleep(2)
    return express_process


def stop_express():
    global express_process
    if express_process:
        express_process.send_signal(signal.SIGTERM)
        express_process.wait(timeout=5)
        express_process = None


@asynccontextmanager
async def lifespan(application: FastAPI):
    start_express()
    yield
    stop_express()


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.api_route("/api/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"])
async def proxy_api(request: Request, path: str):
    url = f"{EXPRESS_URL}/api/{path}"
    if request.url.query:
        url += f"?{request.url.query}"

    body = await request.body()
    headers = dict(request.headers)
    headers.pop("host", None)
    headers.pop("content-length", None)

    async with httpx.AsyncClient(timeout=60.0) as client:
        try:
            resp = await client.request(
                method=request.method,
                url=url,
                content=body if body else None,
                headers=headers,
            )
            excluded = {"transfer-encoding", "content-encoding", "content-length"}
            resp_headers = {
                k: v for k, v in resp.headers.items() if k.lower() not in excluded
            }
            return Response(
                content=resp.content,
                status_code=resp.status_code,
                headers=resp_headers,
            )
        except httpx.ConnectError:
            return Response(
                content='{"success":false,"message":"Backend service starting..."}',
                status_code=503,
                media_type="application/json",
            )
        except Exception as e:
            return Response(
                content=f'{{"success":false,"message":"{str(e)}"}}',
                status_code=502,
                media_type="application/json",
            )


@app.api_route("/uploads/{path:path}", methods=["GET"])
async def proxy_uploads(request: Request, path: str):
    url = f"{EXPRESS_URL}/uploads/{path}"
    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            resp = await client.get(url)
            excluded = {"transfer-encoding", "content-encoding", "content-length"}
            resp_headers = {
                k: v for k, v in resp.headers.items() if k.lower() not in excluded
            }
            return Response(
                content=resp.content,
                status_code=resp.status_code,
                headers=resp_headers,
            )
        except Exception:
            return Response(status_code=404)


@app.get("/")
async def root():
    return {"success": True, "message": "Sowberry API Proxy", "version": "1.0.0"}

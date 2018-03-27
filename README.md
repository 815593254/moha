# plus1s.live
你的服务器除了用来挂SS外，还可以拿来续

### 使用方法
```
curl aoaoao.me:1926
```

### 自行搭建

go

```
go build stream.go
./stream
```

nodejs

```
npm install
node stream.js
```

docker(go)

```
docker build -f Dockerfile-go -t plus1s:live .
docker run -it -p 1926:1926 plus:live
```

详细说明：https://aoaoao.me/1502.html

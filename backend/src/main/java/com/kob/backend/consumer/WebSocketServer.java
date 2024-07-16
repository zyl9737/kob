package com.kob.backend.consumer;

import com.alibaba.fastjson2.JSONObject;
import com.kob.backend.consumer.utils.JwtAuthentication;
import com.kob.backend.mapper.UserMapper;
import com.kob.backend.pojo.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Component;

import javax.websocket.*;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.Iterator;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;

@Component
@ServerEndpoint("/websocket/{token}")  // 注意不要以'/'结尾
public class WebSocketServer {
    // ConcurrentHashMap是一个线程安全的哈希表，用于将用户ID映射到WS实例
    private static final ConcurrentHashMap<Integer, WebSocketServer> users = new ConcurrentHashMap<>();
    // CopyOnWriteArraySet也是线程安全的
    private static final CopyOnWriteArraySet<User> matchPool = new CopyOnWriteArraySet<>();
    private Session session = null;
    private User user;
    private static UserMapper userMapper;

    @Autowired
    public void setUserMapper(UserMapper userMapper) {
        WebSocketServer.userMapper = userMapper;
    }

    @OnOpen
    public void onOpen(Session session, @PathParam("token") String token) throws IOException {
        // 建立链接
        this.session = session;
        System.out.println("Connected!");

        Integer userId = JwtAuthentication.getUserId(token);
        this.user = userMapper.selectById(userId);

        if (user != null){
            users.put(userId, this);
        } else {
            this.session.close();
        }

    }

    @OnClose
    public void onClose() {
        // 关闭链接
        System.out.println("Disconnected!");
        if (this.user != null) {
            users.remove(this.user.getId());
        }

    }

    @OnMessage
    public void onMessage(String message, Session session) {
        // 从Client接收消息
        System.out.println("Received message: " + message);
        JSONObject data = JSONObject.parseObject(message);
        String event = data.getString("event");  // 取出event的内容

        if ("start_match".equals(event)) {
            this.startMatching();
        } else if ("stop_match".equals(event)) {
            this.stopMatching();
        }
    }

    @OnError
    public void onError(Session session, Throwable error) {
        error.printStackTrace();
    }

    public void sendMessage(String message) {
        // 向Client发送消息
        synchronized (this.session) {
            try {
                this.session.getBasicRemote().sendText(message);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
    public void startMatching() {
        System.out.println("Start matching!");
        matchPool.add(this.user);

        while (matchPool.size() >= 2) {
            Iterator<User> it = matchPool.iterator();
            User a = it.next(), b = it.next();
            matchPool.remove(a);
            matchPool.remove(b);

            JSONObject resA = new JSONObject();
            resA.put("event", "match_success");
            resA.put("opponent_username", b.getUsername());
            resA.put("opponent_photo", b.getPhoto());
            users.get(a.getId()).sendMessage(resA.toJSONString()); // A不一定是当前链接，因此要在users中获取

            JSONObject resB = new JSONObject();
            resB.put("event", "match_success");
            resB.put("opponent_username", a.getUsername());
            resB.put("opponent_photo", a.getPhoto());
            users.get(b.getId()).sendMessage(resB.toJSONString()); // A不一定是当前链接，因此要在users中获取
        }

    }

    private void stopMatching() {
        System.out.println("Stop matching!");
        matchPool.remove(this.user);
    }
}
package com.kob.matchingsystem.service.impl;

import com.kob.matchingsystem.service.MatchingService;
import com.kob.matchingsystem.service.impl.utils.MatchingPool;
import org.springframework.stereotype.Service;

@Service
public class MatchingServiceImpl implements MatchingService {
    public static final MatchingPool matchingPool = new MatchingPool();


    @Override
    public String addPlayer(Integer uerId, Integer Rating) {
        System.out.println("Add Player: " + uerId + " with rating: " + Rating);
        matchingPool.addPlayer(uerId, Rating);
        return "success";
    }

    @Override
    public String removePlayer(Integer userId) {
        System.out.println("Remove Player: " + userId);
        matchingPool.removePlayer(userId);
        return "success";
    }
}

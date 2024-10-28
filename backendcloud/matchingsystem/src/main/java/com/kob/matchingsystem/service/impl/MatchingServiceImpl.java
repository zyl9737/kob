package com.kob.matchingsystem.service.impl;

import com.kob.matchingsystem.service.MatchingService;
import org.springframework.stereotype.Service;

@Service
public class MatchingServiceImpl implements MatchingService {


    @Override
    public String addPlayer(Integer uerId, Integer Rating) {
        System.out.println("Add Player: " + uerId + " with rating: " + Rating);
        return "success";
    }

    @Override
    public String removePlayer(Integer userId) {
        System.out.println("Remove Player: " + userId);
        return "success";
    }
}

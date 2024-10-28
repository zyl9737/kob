package com.kob.matchingsystem.service;

public interface MatchingService {
    String addPlayer(Integer uerId, Integer Rating);
    String removePlayer(Integer userId);
}

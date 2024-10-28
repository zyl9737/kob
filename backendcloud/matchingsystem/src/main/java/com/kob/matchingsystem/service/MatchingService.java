package com.kob.matchingsystem.service;

public interface MatchingService {
    String addPlayer(Integer uerId, Integer Rating);  // add player to the matching pool
    String removePlayer(Integer userId); // remove player from the matching pool
}

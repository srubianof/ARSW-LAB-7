/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package edu.eci.arsw.cinema.services;

import edu.eci.arsw.cinema.filter.*;
import edu.eci.arsw.cinema.model.*;
import edu.eci.arsw.cinema.persistence.*;

import java.util.*;

import org.springframework.beans.factory.annotation.*;
import org.springframework.stereotype.Service;

@Service("cService")
public class CinemaServices {
    @Autowired
    @Qualifier("inMemoryCP")
    CinemaPersitence cps;
    @Autowired
    @Qualifier("FilterByA")
    CinemaFilterI cf;


    public Set<Cinema> getAllCinemas() throws CinemaException {
        return cps.getAllCinemas();
    }

    public Cinema getCinemaByName(String name) throws CinemaException, CinemaPersistenceException {
        return cps.getCinema(name);
    }


    public void buyTicket(int row, int col, String cinema, String date, String movieName) throws CinemaException {
        cps.buyTicket(row, col, cinema, date, movieName);
    }

    public List<CinemaFunction> getFunctionsByCinemaAndDate(String cinema, String date) throws CinemaPersistenceException {
        return cps.getFunctionsbyCinemaAndDate(cinema, date);
    }


    public List<Movie> filter(String cinema, String date, String filter) throws CinemaException, CinemaPersistenceException, CinemaFilterException {
        Cinema cinemA = this.getCinemaByName(cinema);
        return cf.filerMovie(cinemA, date, filter);
    }

    public CinemaFunction getFunctionByCinemaDateAndMovieName(String cinema, String date, String movieName) throws CinemaPersistenceException {
        return cps.getFunctionByCinemaDateAndMovieName(cinema, date, movieName);

    }


    public void addFunctionToCinema(String name, CinemaFunction cinemaFunction) throws CinemaPersistenceException {
        Cinema cinema = cps.getCinema(name);
        cinema.addFuncion(cinemaFunction);
    }

    public CinemaFunction updateOrCreateFunction(String name, String[] cinemaFunction) throws CinemaPersistenceException {
        return cps.updateOrCreateFunction(name, cinemaFunction);

    }

    public void deleteFunction(String cinemaName, String date, String movieName) throws CinemaPersistenceException {
        Cinema cinema = cps.getCinema(cinemaName);
        CinemaFunction function=null;
        for (CinemaFunction cf:cinema.getFunctions()) {
            if (cf.getMovie().getName().equals(movieName) && cf.getDate().equals(date)){
                function=cf;
                cinema.getFunctions().remove(function);
                break;
            }

        }

    }
}

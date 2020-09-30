/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package edu.eci.arsw.cinema.persistence.impl;

import edu.eci.arsw.cinema.model.Cinema;
import edu.eci.arsw.cinema.model.CinemaFunction;
import edu.eci.arsw.cinema.model.Movie;
import edu.eci.arsw.cinema.persistence.CinemaException;
import edu.eci.arsw.cinema.persistence.CinemaPersistenceException;
import edu.eci.arsw.cinema.persistence.CinemaPersitence;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * The type In memory cinema persistence.
 */
@Component
@Qualifier("inMemoryCP")
public class InMemoryCinemaPersistence implements CinemaPersitence {

    private final ConcurrentHashMap<String, Cinema> cinemas = new ConcurrentHashMap<>();

    /**
     * Instantiates a new In memory cinema persistence.
     */
    public InMemoryCinemaPersistence() {
        //load stub data
        String functionDate = "2018-12-18 15:30";
        List<CinemaFunction> functions = new ArrayList<>();
        List<CinemaFunction> functions2 = new ArrayList<>();
        List<CinemaFunction> functions3 = new ArrayList<>();
        CinemaFunction funct1 = new CinemaFunction(new Movie("SuperHeroes Movie", "Action"), functionDate);
        CinemaFunction funct2 = new CinemaFunction(new Movie("The Night", "Horror"), functionDate);
        functions.add(funct1);
        functions.add(funct2);
        Cinema c = new Cinema("cinemaX", functions);
        CinemaFunction funct3 = new CinemaFunction(new Movie("SuperTurtles Movie", "Drama"), functionDate);
        CinemaFunction funct4 = new CinemaFunction(new Movie("The Day", "Horror"), functionDate);
        functions2.add(funct3);
        functions2.add(funct4);
        Cinema d = new Cinema("cinemaY", functions2);
        CinemaFunction funct5 = new CinemaFunction(new Movie("SuperMovie about Nothing", "Comedia"), functionDate);
        CinemaFunction funct6 = new CinemaFunction(new Movie("The MidDay", "Comedia"), functionDate);
        functions3.add(funct5);
        functions3.add(funct6);
        Cinema e = new Cinema("cinemaZ", functions3);
        cinemas.put("cinemaX", c);
        cinemas.put("cinemaY", d);
        cinemas.put("cinemaZ", e);
    }

    @Override
    public void buyTicket(int row, int col, String cinema, String date, String movieName) throws CinemaException {
        Cinema cinemaTicket = this.cinemas.get(cinema);
        List<CinemaFunction> functionsOfOurCinema = cinemaTicket.getFunctions();
        boolean functionFound = false;
        for (CinemaFunction cf : functionsOfOurCinema) {
            if (cf.getMovie().getName().equals(movieName) && cf.getDate().equals(date)) {
                cf.buyTicket(row, col);
                functionFound = true;
            }
        }
        if (!functionFound) {
            throw new CinemaException("No se encontraron funciones con los parametros indicados.");
        }
    }

    @Override
    public List<CinemaFunction> getFunctionsbyCinemaAndDate(String cinema, String date) throws CinemaPersistenceException {
        List<CinemaFunction> functions = new LinkedList<CinemaFunction>();
        Cinema cinemaTicket = this.cinemas.get(cinema);
        List<CinemaFunction> functionsOfOurCinema = cinemaTicket.getFunctions();

        for (CinemaFunction cf : functionsOfOurCinema) {
            if (cf.getDate().contains(date)) {
                functions.add(cf);
            }
        }
        if (functions.size() == 0) {
            throw new CinemaPersistenceException("Not functions found.");
        }
        return functions;

    }

    @Override
    public void saveCinema(Cinema c) throws CinemaPersistenceException {
        if (cinemas.containsKey(c.getName())) {
            throw new CinemaPersistenceException("The given cinema already exists: " + c.getName());
        } else {
            cinemas.put(c.getName(), c);
        }
    }

    @Override
    public Cinema getCinema(String name) throws CinemaPersistenceException {
        if (cinemas.get(name) == null) {
            throw new CinemaPersistenceException("Not cinema Found");
        }
        return cinemas.get(name);
    }

    @Override
    public Set<Cinema> getAllCinemas() throws CinemaException {
        if (cinemas.isEmpty()) {
            throw new CinemaException("There are no cinemas to show");
        }
        return new HashSet<>(cinemas.values());
    }

    @Override
    public CinemaFunction getFunctionByCinemaDateAndMovieName(String cinema, String date, String movieName) throws CinemaPersistenceException {
        List<CinemaFunction> functions = new LinkedList<CinemaFunction>();
        Cinema cinemaTicket = this.cinemas.get(cinema);
        List<CinemaFunction> functionsOfOurCinema = cinemaTicket.getFunctions();
        CinemaFunction function = null;
        for (CinemaFunction cf : functionsOfOurCinema) {
            if (cf.getDate().equals(date) && cf.getMovie().getName().equals(movieName)) {
                function = cf;
            }
        }
        if (function == null) {
            throw new CinemaPersistenceException("Not function found.");
        }
        return function;
    }

    @Override
    public CinemaFunction updateOrCreateFunction(String name, String[] cinemaFunction) throws CinemaPersistenceException {
        System.out.println();
        Cinema cinema = this.getCinema(name);
        CinemaFunction updatedFunction = null;
        if (cinema == null) {
            throw new CinemaPersistenceException("Not cinema found.");
        }
        List<CinemaFunction> functions = cinema.getFunctions();
        for (CinemaFunction f : functions) {
            if (f.getMovie().getName().equals(cinemaFunction[0])) {
                updatedFunction = f;
                f.setDate(cinemaFunction[1]);
                Movie movieN = new Movie();
                movieN.setName(cinemaFunction[0]);
                movieN.setGenre(cinemaFunction[2]);
                f.setMovie(movieN);
            }
        }
        if (updatedFunction == null) {
            CinemaFunction cinemaFunctionN = new CinemaFunction(new Movie(cinemaFunction[0], cinemaFunction[2]), cinemaFunction[1]);
            cinema.addFuncion(cinemaFunctionN);
            return cinemaFunctionN;
        }
        return updatedFunction;

    }

}

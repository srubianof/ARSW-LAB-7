/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package edu.eci.arsw.cinema.persistence;

import edu.eci.arsw.cinema.model.Cinema;
import edu.eci.arsw.cinema.model.CinemaFunction;

import java.util.List;
import java.util.Set;

/**
 * The interface Cinema persitence.
 *
 * @author cristian
 */
public interface CinemaPersitence {

    /**
     * Buy ticket.
     *
     * @param row       the row of the seat
     * @param col       the column of the seat
     * @param cinema    the cinema's name
     * @param date      the date of the function
     * @param movieName the name of the movie
     * @throws CinemaException if the seat is occupied,                         or any other low-level persistence error occurs.
     */
    public void buyTicket(int row, int col, String cinema, String date, String movieName) throws CinemaException;

    /**
     * Gets functionsby cinema and date.
     *
     * @param cinema cinema's name
     * @param date   date
     * @return the list of the functions of the cinema in the given date
     * @throws CinemaPersistenceException the cinema persistence exception
     */
    public List<CinemaFunction> getFunctionsbyCinemaAndDate(String cinema, String date) throws CinemaPersistenceException;

    /**
     * Save cinema.
     *
     * @param cinema new cinema
     * @throws CinemaPersistenceException n if a cinema with the same name already exists
     */
    public void saveCinema(Cinema cinema) throws CinemaPersistenceException;

    /**
     * Gets cinema.
     *
     * @param name name of the cinema
     * @return Cinema of the given name
     * @throws CinemaPersistenceException if there is no such cinema
     */
    public Cinema getCinema(String name) throws CinemaPersistenceException;

    /**
     * Gets all cinemas.
     *
     * @return the all cinemas
     * @throws CinemaException the cinema exception
     */
    Set<Cinema> getAllCinemas() throws CinemaException;

    /**
     * Gets function by cinema date and movie name.
     *
     * @param cinema    the cinema
     * @param date      the date
     * @param movieName the movie name
     * @return the function by cinema date and movie name
     * @throws CinemaPersistenceException the cinema persistence exception
     */
    CinemaFunction getFunctionByCinemaDateAndMovieName(String cinema, String date, String movieName) throws CinemaPersistenceException;

    /**
     * Update or create function cinema function.
     *
     * @param name           the name
     * @param cinemaFunction the cinema function
     * @return the cinema function
     * @throws CinemaPersistenceException the cinema persistence exception
     */
    CinemaFunction updateOrCreateFunction(String name, String[] cinemaFunction) throws CinemaPersistenceException;

}

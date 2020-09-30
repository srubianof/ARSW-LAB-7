package edu.eci.arsw.cinema.filter;

import edu.eci.arsw.cinema.model.Cinema;
import edu.eci.arsw.cinema.model.Movie;

import java.util.List;


/**
 * The interface Cinema filter i.
 */

public interface CinemaFilterI {
    /**
     * Filer movie list.
     *
     * @param cinema the cinema
     * @param date   the date
     * @param filter the filter
     * @return the list
     * @throws CinemaFilterException the cinema filter exception
     */
    public List<Movie> filerMovie(Cinema cinema, String date, String filter) throws CinemaFilterException;
}

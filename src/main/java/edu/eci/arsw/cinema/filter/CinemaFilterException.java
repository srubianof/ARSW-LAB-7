package edu.eci.arsw.cinema.filter;

/**
 * The type Cinema filter exception.
 */

public class CinemaFilterException extends Exception {

    /**
     * The constant ms1.
     */
    public static final String ms1 = "El genero no puede ser NUMERICO";
    /**
     * The constant ms2.
     */
    public static final String ms2 = "La disponibilidad debe ser NUMERICA";

    /**
     * Instantiates a new Cinema filter exception.
     *
     * @param message the message
     */
    public CinemaFilterException(String message) {
        super(message);
    }

}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package edu.eci.arsw.cinema.persistence;


/**
 * The type Cinema exception.
 *
 * @author cristian
 */
public class CinemaException extends Exception{

    /**
     * Instantiates a new Cinema exception.
     *
     * @param message the message
     */
    public CinemaException(String message) {
        super(message);
    }

    /**
     * Instantiates a new Cinema exception.
     *
     * @param message the message
     * @param cause   the cause
     */
    public CinemaException(String message, Throwable cause) {
        super(message, cause);
    }
    
}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package edu.eci.arsw.cinema.persistence;

/**
 * The type Cinema persistence exception.
 *
 * @author cristian
 */

public class CinemaPersistenceException extends Exception{

    /**
     * Instantiates a new Cinema persistence exception.
     *
     * @param message the message
     */
    public CinemaPersistenceException(String message) {
        super(message);
    }

    /**
     * Instantiates a new Cinema persistence exception.
     *
     * @param message the message
     * @param cause   the cause
     */
    public CinemaPersistenceException(String message, Throwable cause) {
        super(message, cause);
    } 
    
}

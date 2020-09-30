/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package edu.eci.arsw.cinema.controllers;

import java.util.*;
import java.util.logging.Level;
import java.util.logging.Logger;

import edu.eci.arsw.cinema.model.*;
import edu.eci.arsw.cinema.services.CinemaServices;
import org.springframework.beans.factory.annotation.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/")
public class CinemaAPIController {

    @Autowired
    CinemaServices cinemaServices;

    @GetMapping("/cinemas")
    public ResponseEntity<?> cinemas() {
        try {
            Set<Cinema> data = cinemaServices.getAllCinemas();
            //obtener datos que se enviarán a través del API

            return new ResponseEntity<>(data, HttpStatus.OK);
        } catch (Exception ex) {
            Logger.getLogger(CinemaAPIController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>("Error bla bla bla", HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/cinemas/{name}")
    public ResponseEntity<?> cinemaByName(@PathVariable String name) {
        try {
            Cinema data = cinemaServices.getCinemaByName(name);
            //obtener datos que se enviarán a través del API

            return new ResponseEntity<>(data, HttpStatus.OK);
        } catch (Exception ex) {
            Logger.getLogger(CinemaAPIController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>("Not cinema found.", HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/cinemas/{name}/{date}")
    public ResponseEntity<?> cinemaByNameAndDate(@PathVariable String name, @PathVariable String date) {
        try {
            List<CinemaFunction> data = cinemaServices.getFunctionsByCinemaAndDate(name, date);
            //obtener datos que se enviarán a través del API

            return new ResponseEntity<>(data, HttpStatus.OK);
        } catch (Exception ex) {
            Logger.getLogger(CinemaAPIController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>("Not found.", HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/cinemas/{name}/{date}/{movieName}")
    public ResponseEntity<?> cinemaByNameDateAndMovieName(@PathVariable String name, @PathVariable String date, @PathVariable String movieName) {
        try {
            CinemaFunction data = cinemaServices.getFunctionByCinemaDateAndMovieName(name, date, movieName);
            //obtener datos que se enviarán a través del API

            return new ResponseEntity<>(data, HttpStatus.OK);
        } catch (Exception ex) {
            Logger.getLogger(CinemaAPIController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>("Not found.", HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/cinemas/{name}")
    public ResponseEntity<?> addFunctionToCinema(@RequestBody CinemaFunction cinemaFunction, @PathVariable String name) {
        try {
            cinemaServices.addFunctionToCinema(name, cinemaFunction);
            return new ResponseEntity<>(HttpStatus.CREATED);
        } catch (Exception ex) {
            Logger.getLogger(CinemaAPIController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>("Not possible, failed to create function", HttpStatus.FORBIDDEN);
        }
    }

    @PutMapping("/cinemas/{name}")
    public ResponseEntity<?> updateCinemaFunction(@RequestBody String[] cinemaFunction, @PathVariable String name) {
        try {
            return new ResponseEntity<>(cinemaServices.updateOrCreateFunction(name, cinemaFunction), HttpStatus.CREATED);

        } catch (Exception ex) {
            Logger.getLogger(CinemaAPIController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>("Not possible, failed to find cinema", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("cinemas/{name}/{date}/{movie}/{row}/{col}")
    public ResponseEntity<?> buyTicket(@PathVariable String name, @PathVariable String date, @PathVariable String movie, @PathVariable String row, @PathVariable String col) {
        try {
            cinemaServices.buyTicket(Integer.parseInt(row), Integer.parseInt(col), name, date, movie);
            return new ResponseEntity<>(HttpStatus.CREATED);

        } catch (Exception ex) {
            Logger.getLogger(CinemaAPIController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>("Not possible, seat already bought", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @DeleteMapping("/cinemas/{name}/{date}/{movieName}")
    public ResponseEntity<?> deleteFunction(@PathVariable String name, @PathVariable String date, @PathVariable String movieName) {
        try {
            cinemaServices.deleteFunction(name,date,movieName);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);

        } catch (Exception ex) {
            Logger.getLogger(CinemaAPIController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>("Not possible, seat already bought", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


}
    


const { response } = require('express');
const Event = require('../models/Event');




const getEvents = async (req, res = response) => {

    const events = await Event.find()
    .populate('user', 'name');

    return res.status(200).json({
        ok: true,
        events
    });

}

const createEvent = async (req, res = response) => {

    
    const event = new Event( req.body );

    try {

        event.user = req.uid;

        const eventSaved = await event.save();

        return res.status(200).json({
            ok: true,
            event: eventSaved
        });
        
    } catch (error) {   

        return res.status(500).json({
            ok: false,
            msg: 'Try with your administrator'
        });
    }

}

const updateEvent = async (req, res = response) => {

    const eventId = req.params.id;
    const uid = req.uid;

    try {
        
        const event = await Event.findById( eventId );

        if ( !event ) {
            return res.status(400).json({
                ok: false,
                msg: 'there is no record with that id'
            });
        }

        if ( event.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No privileges'
            });
        }

        const newEvent = {
            ...req.body,
            user: uid
        };

        const eventUpdated = await Event.findByIdAndUpdate( eventId, newEvent, { new: true } );

        return res.status(200).json({
            ok: true,
            event: eventUpdated
        });

    } catch (error) {
        
        return res.status(500).json({
            ok: false,
            msg: 'Try with your administrator'
        });
    }

}

const deleteEvent = async (req, res = response) => {

    const eventId = req.params.id;
    const uid = req.uid;

    try {
        
        const event = await Event.findById( eventId );

        if ( !event ) {
            return res.status(400).json({
                ok: false,
                msg: 'there is no record with that id'
            });
        }

        if ( event.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No privileges'
            });
        }
        
        await Event.findByIdAndDelete( eventId );

        return res.status(200).json({
            ok: true
        });

    } catch (error) {
        
        return res.status(500).json({
            ok: false,
            msg: 'Try with your administrator'
        });
    }

}


module.exports = {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent
}
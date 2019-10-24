const _ = require('lodash');
const dbConnector = require('./db-connector');


const INSERT_EVENT_SQL = 'insert into events (event_id, event_type, object_id, occurred_at) values (?, ?, ?, ?)';
const GET_CONTACTS_SQL = 'select distinct object_id from events order by id desc limit 10';
const GET_EVENTS_FOR_CONTACT_SQL = 'select event_type from events where object_id = ? order by occurred_at asc';
const GET_ALL_EVENTS_SQL = 'select * from events order by occurred_at asc';
const GET_NEW_EVENTS_COUNT_SQL = 'select count(*) from events where shown = 0';
const SET_EVENTS_SHOWN_SQL = 'update events set shown = 1 where shown = 0';


module.exports = {
  getContacts: () => dbConnector.all(GET_CONTACTS_SQL),
  getEventsForContact: (contactId) => dbConnector.all(GET_EVENTS_FOR_CONTACT_SQL, contactId),
  addEvent: (event) => dbConnector.run(INSERT_EVENT_SQL, [event.eventId, event.subscriptionType, event.objectId, event.occurredAt]),
  getAllEvents: () => dbConnector.all(GET_ALL_EVENTS_SQL),
  setAllWebhooksEventsShown: () => dbConnector.run(SET_EVENTS_SHOWN_SQL),
  getNewEventsCount: async () => {
    const QUERY_KEY = `count(*)`;
    const eventsCountResponse = await dbConnector.get(GET_NEW_EVENTS_COUNT_SQL);
    return eventsCountResponse[QUERY_KEY];
  }
};

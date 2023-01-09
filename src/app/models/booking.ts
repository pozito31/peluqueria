import { IBooking } from "../interfaces/ibooking";
import * as _ from 'lodash';

export class Booking implements IBooking {

  constructor(data) {
        _.set(this, 'data', data);
    }

    get name() {
        return _.get(this, 'data.name');
    }

    get date() {
        return _.get(this, 'data.date');
    }

    get service() {
        return _.get(this, 'data.service');
    }

    getData() {
        return _.get(this, 'data')
    }

}

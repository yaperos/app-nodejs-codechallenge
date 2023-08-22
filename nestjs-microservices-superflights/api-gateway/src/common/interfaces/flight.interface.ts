import { IPassenger } from 'src/common/interfaces/passenger.interface';
import { IWeather } from './weather.interface';
export interface IFlight {
  _id?: string;
  pilot: string;
  airplane: string;
  destinationCity: string;
  flightDate: Date;
  passengers: IPassenger[];
  weather: IWeather[];
}

import filter from 'lodash/filter';
import { computeSpotBelonging } from './getSpotBelonging';

export default (travelers, filterObj) => {
  if (
    filterObj.status.ok ||
    filterObj.status.alarm ||
    filterObj.status.warning
  ) {
    travelers = filter(travelers, (traveler) => {
      const status = traveler.currentJourneyStatus;
      if (
        (status === 'ok' && filterObj.status.ok) ||
        (status === 'alarm' && filterObj.status.alarm) ||
        (status === 'warning' && filterObj.status.warning)
      ) {
        return true;
      }
      return false;
    });
  }
  if (filterObj.vip) {
    travelers = filter(travelers, { isVIP: true });
  }
  if (filterObj.nonHelped) {
    travelers = filter(travelers, (traveler) => {
      if (traveler.helpedBy && traveler.helpedBy.status !== 'opened' && traveler.helpedBy.status !== 'closed') {
        return true;
      }
      return false;
    });
  }

  if (filterObj.company && typeof filterObj.company === 'string' && filterObj.company.length > 0) {
    travelers = filter(travelers, (traveler) => {
      if (traveler.organization && traveler.organization._id) {
        return filterObj.company.indexOf(traveler.organization._id.$oid) !== -1;
      }
      return false;
    });
  }

  if (filterObj.costcenter_id && typeof filterObj.costcenter_id === 'string' && filterObj.costcenter_id.length > 0) {
    travelers = filter(travelers, (traveler) => {
      if (traveler.costCenter && traveler.costCenter._id) {
        return filterObj.costcenter_id.indexOf(traveler.costCenter._id.$oid) !== -1;
      }
      return false;
    });
  }

  if (filterObj.areaShown) {
    travelers = filter(
      travelers,
      traveler => computeSpotBelonging(traveler) === filterObj.areaShown
    );
  }

  return travelers;
};

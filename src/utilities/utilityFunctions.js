import moment from "moment";
export function timeAgo(timestring) {
    return moment(timestring).fromNow();
  }
  
  
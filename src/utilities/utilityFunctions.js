import moment from "moment";
export function timeAgo(timestring) {
    console.log(timestring,'timestring')
    return moment(timestring).fromNow();

  }
  
  
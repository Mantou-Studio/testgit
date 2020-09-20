const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatDate = date=>{
  const year = date.getFullYear()
  const month=date.getMonth()+1
  const day=date.getDate()
  const hour=date.getHours()
  const minute=date.getMinutes()
  const second=date.getSeconds()

  return [year,month,day,hour,minute,second].map(formatNumber).join('')
}

const randomWork= n=>{
  const chars = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
  let str = ""
  for(let i=0;i<n;i++){
    str+=chars[parseInt(Math.random()*61)]
  }
  return str
}

const getTimeDifference = s =>{
  var time=new Date(formatTime(new Date)).getTime()-new Date(s).getTime()
  var minute = parseInt(time/(1000*60))
  var hour=parseInt(time/(1000*60*60))
  var day = parseInt(time/(1000*3600*24))
  var month = parseInt(time/(1000*3600*24*30))
  var year= parseInt(time/(1000*3600*24*30*12))
  if(minute<=0){
    return "刚刚"
  }else if(minute>0&&minute<60){
    return minute+"分钟前"
  }else if(hour>0&&hour<24){
    return hour + "小时前"
  }else if(day>0&&day<30){
   return day+"天前";
  }else if(month>0&&month<12){
    return month+"个月前"
  }else if(year>0){
    return year+"年前"
  }
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const formatSelectDate=date=>{
  const year = date.getFullYear()
  const month=date.getMonth()+1
  const day=date.getDate()
  return [year,month,day].map(formatNumber).join('-')
}

module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  randomWork: randomWork,
  getTimeDifference:getTimeDifference,
  formatSelectDate
}

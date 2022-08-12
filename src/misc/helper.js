export function getNameInitials(name) {
  const splitName = name.toUpperCase().split(" ");
  if (splitName.length > 1) {
    return splitName[0][0] + splitName[1][0];
  }
  return splitName[0][0];
}

export function transformToArr(snapVal){
    return snapVal
    ? Object.keys(snapVal):[]
}

export function transformToArrWithId(snapVal) {
  return snapVal
    ? Object.keys(snapVal).map((roomId) => {
        return { ...snapVal[roomId], id: roomId };
      })
    : [];
}

export async function getUserUpdate(userId, keyToUpdate, value, db) {
  const updates = {};
  updates[`/profiles/${userId}/${keyToUpdate}`] = value;
  const getMsgs = db
    .ref("/messages")
    .orderByChild("author/uid")
    .equalTo(userId)
    .once("value");
  const getRooms = db
    .ref("/rooms")
    .orderByChild("/lastMessage/author/uid")
    .equalTo(userId)
    .once("value");

    const [msgSnap,roomSnap] = await Promise.all([getMsgs,getRooms])

    msgSnap.forEach(mSnap => {
        updates[`/messages/${mSnap.key}/author/${keyToUpdate}`] = value
    })

    roomSnap.forEach(roomSnap => {
        updates[`/rooms/${roomSnap.key}/lastMessage/author/${keyToUpdate}`] = value
    })

    return updates;
}

export function groupBy(array,groupingKeyFn){
 
  return array.reduce((res,item)=>{

    const gKey = groupingKeyFn(item);

    if(!res[gKey]){
      res[gKey]=[]
    }

    res[gKey].push(item);

    return res;
  },{})
}
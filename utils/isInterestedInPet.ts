export function isInterestedInPet(
  interestedUsersList?: string[],
  loggedInUserUID?: string,
) {
  console.log({list: interestedUsersList, user: loggedInUserUID})
  if (!interestedUsersList || !loggedInUserUID) {
    // Se indefinido
    return false
  } else if (interestedUsersList.includes(loggedInUserUID)) {
    // Se está interessado
    return true
  } else {
    // Se não está interessado
    return false
  }
}
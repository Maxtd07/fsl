export const MEMBER_POSITIONS = ['attacker', 'defender', 'midfielder', 'goalkeeper', 'reserve']

export const MEMBER_POSITION_LABELS = {
  attacker: 'Attaccante',
  defender: 'Difensore',
  midfielder: 'Centrocampista',
  goalkeeper: 'Portiere',
  reserve: 'Riserva',
}

export function isPlayerRole(role) {
  return /\bgiocatore\b/i.test(role ?? '')
}

export function sortMembersByName(firstMember, secondMember) {
  return (firstMember?.name ?? '').localeCompare(secondMember?.name ?? '', 'it-IT', {
    sensitivity: 'base',
  })
}

export function formatMemberPosition(position) {
  if (!position) {
    return '-'
  }

  return MEMBER_POSITION_LABELS[position] ?? position
}

export function getMemberDisplayValue(value) {
  if (value === null || value === undefined || value === '') {
    return '-'
  }

  return value
}

import defaultMemberPhoto from '../../assets/persona.png'

function MemberPhoto({ src, alt, className = '' }) {
  return (
    <img
      src={src || defaultMemberPhoto}
      alt={alt}
      className={className}
      onError={(event) => {
        event.currentTarget.onerror = null
        event.currentTarget.src = defaultMemberPhoto
      }}
    />
  )
}

export default MemberPhoto

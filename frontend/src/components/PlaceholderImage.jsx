import fallbackImage from '../assets/filenotfound.jpg'

function PlaceholderImage({ alt, className = '' }) {
  return (
    <div
      className={`overflow-hidden rounded-[1.25rem] border border-primary/15 bg-base/80 shadow-[0_12px_30px_rgba(76,130,169,0.08)] ${className}`}
    >
      <img className="h-full w-full object-cover" src={fallbackImage} alt={alt} />
    </div>
  )
}

export default PlaceholderImage

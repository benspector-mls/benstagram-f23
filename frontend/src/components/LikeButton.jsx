export default function LikeButton({ onClick, isLiked, likes }) {
  return (
    <p onClick={onClick}>
      <span className={`like-icon ${isLiked ? 'liked' : ''}`}>♥︎</span>
      {" " + likes}
    </p>
  )
}
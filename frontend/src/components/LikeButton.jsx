export default function LikeButton({ onClick, isLiked, likes }) {
  return (
    <p onClick={onClick}>
      <span className={`like-button ${isLiked ? 'liked' : ''}`}>{isLiked ? '♥︎' : '♡'}</span> {likes}</p>
  )
}
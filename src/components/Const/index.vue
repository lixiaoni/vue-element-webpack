<script type="text/javascript">
let imageUrl = ''
let privateImageUrl = ''
if (process.env.NODE_ENV === 'production') {
  imageUrl = 'https://image.youlife.me/'
  privateImageUrl = 'https://image-safe.youlife.me/'
} else if (process.env.NODE_ENV === 'development') {
  imageUrl = 'https://dev-image.youlife.me/'
  privateImageUrl = 'https://dev-image-safe.youlife.me/'
}
export default {
  imageUrl,
  privateImageUrl
}
</script>

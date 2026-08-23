function Register() {
  return (
    <div>
      <h2>Log in</h2>
      <form>
        <label>Email</label>
        <input />
        <label>Password</label>
        <input type="password" />
        <button type="submit">Log in</button>
      </form>
      <p>New here? <a href="/register">Create an account</a></p>
    </div>
  );
}
export default Register;
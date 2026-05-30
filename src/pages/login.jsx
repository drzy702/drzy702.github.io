import { useState } from "react"
import {useNavigate} from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import './login.css'

export default function Login() {
    const {login} = useAuth()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            await login(email, password)
            navigate('/admin')
        } catch (err) {
            setError('Failed to log in')
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className="login-page">
            <form className="login-form" onSubmit={handleSubmit}>
                <p className="Login-label">Admin Login</p>
                <h1 className="login-title">Sign in</h1>

                {error && <p className="login-error">{error}</p>}

                <div className="Login-field">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                    />
                </div>

                <div className="login-field">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                    />
                </div>

                <button className="login-btn" type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Log In'}
                </button>
            </form>
        </section>
    )
}

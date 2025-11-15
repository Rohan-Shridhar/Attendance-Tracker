function LoginPage({ onNavigate = () => {} }){
    return(
        <div className="LoginPage">
            <h2
                role="button"
                tabIndex={0}
                onClick={() => onNavigate('student')}
                onKeyDown={(e) => { if (e.key === 'Enter') onNavigate('student'); }}
            >
                Student Login
            </h2>
            <h2
                role="button"
                tabIndex={0}
                onClick={() => onNavigate('teacher')}
                onKeyDown={(e) => { if (e.key === 'Enter') onNavigate('teacher'); }}
            >
                Teacher Login
            </h2>
        </div>
    );
}
export default LoginPage;
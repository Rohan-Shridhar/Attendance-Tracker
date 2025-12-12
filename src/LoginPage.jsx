import studentIcon from './assets/student.png';
import teacherIcon from './assets/teacher.png';
import classIcon from './assets/class.png';

function LoginPage({ onNavigate = () => {} }){
    return(
        <div className="LoginPage">
            <h3 className="login-prompt">Who is using?</h3>
            <h2
                role="button"
                tabIndex={0}
                onClick={() => onNavigate('student')}
            >
                <img src={studentIcon} alt="Student" style={{ height: '24px', marginRight: '10px', verticalAlign: 'middle' }} />
                <span>Student</span>
            </h2>
            <h2
                role="button"
                tabIndex={0}
                onClick={() => onNavigate('teacher')} 
                onKeyDown={(e) => { if (e.key === 'Enter') onNavigate('teacher'); }}
            >
                <img src={teacherIcon} alt="Teacher" style={{ height: '24px', marginRight: '10px', verticalAlign: 'middle' }} />
                <span>Teacher</span>
            </h2>
            <h2
                role="button"
                tabIndex={0}
                onClick={() => onNavigate('hod')}
                onKeyDown={(e) => { if (e.key === 'Enter') onNavigate('hod'); }}
            >
                <img src={classIcon} alt="HOD" style={{ height: '24px', marginRight: '10px', verticalAlign: 'middle' }} />
                <span>HOD</span>
            </h2>
        </div>
    );
}
export default LoginPage;
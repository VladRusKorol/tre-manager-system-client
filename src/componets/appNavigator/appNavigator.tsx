import { Button, Toolbar } from "devextreme-react"
import { Item } from "devextreme-react/toolbar";
import "./appNavigatorStyles.css"; // Импорт стилей
import { useNavigate } from "react-router-dom";

export const AppNavigator: React.FC = () => {

    const navigate = useNavigate();

    return (
        <div className="app-navigator">
            <Toolbar>
                <Item location="before">
                    <div className="logo-container">
                        <span className="logo-subtitle">Корпоративная система учета КГШ</span>
                    </div>
                </Item>
                
                <Item location="before">
                    <Button
                        text="АДМИНИСТРИРОВАНИЕ"
                        icon="preferences"
                        type="default"
                        className="nav-button"
                        onClick={() => navigate('/administration')}
                    />
                </Item>
                
                <Item location="before">
                    <Button
                        text="УЧЕТ"
                        icon="product"
                        type="default"
                        className="nav-button"
                        onClick={() => navigate('/accounting')}
                    />
                </Item>
            </Toolbar>
        </div>
    )
}
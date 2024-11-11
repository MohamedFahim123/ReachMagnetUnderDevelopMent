import React, { useEffect, useRef, useState } from "react";
import './customeDropdownSelect.css'
const CustomDropdown = ({ countries, errors, setValue, inputName}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const dropdownRef = useRef(null);

    const handleSelect = (country) => {
        setSelectedOption(country);
        setIsOpen(false);
        setValue(inputName, country?.phoneCode);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false); // Close dropdown if click happens outside
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="custom-dropdown position-relative" ref={dropdownRef}>
            {/* Selected Value */}
            <div
                className={`form-select d-flex align-items-center justify-content-between ${errors.phone_code ? "is-invalid" : ""}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                {selectedOption ? (
                    <div className="d-flex align-items-center">
                        <img
                            src={selectedOption?.flag}
                            alt=""
                            style={{ width: 20, height: 15, marginRight: 10 }}
                        />
                        {selectedOption?.phoneCode}
                    </div>
                ) : (
                    "code"
                )}
                <i className="bi bi-chevron-down"></i>
            </div>

            {/* Dropdown Options */}
            {isOpen && (
                <ul className="dropdown-menu w-100 show">
                    {countries?.map((country) => (
                        <li
                            key={country?.phoneCode}
                            className="dropdown-item d-flex align-items-center"
                            onClick={() => handleSelect(country)}
                        >
                            <img
                                src={country?.flag}
                                alt=""
                                style={{ width: 20, height: 20, borderRadius: "50%", marginRight: 10 }}
                            />
                            {country?.phoneCode}
                        </li>
                    ))}
                </ul>
            )}

            {/* Validation Error */}
            {errors.phone_code && <span className="text-danger">{errors?.phone_code.message}</span>}
        </div>
    );
};

export default CustomDropdown;

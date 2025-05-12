import React from "react";
import Select from "react-select";

const CustomDropdown = ({
    optionsData,
    inputName,
    placeholder,
    isFlagDropdown = false,
    setValue, // optional
    errors, // optional
    handleInputChange, // optional
    value, // optional 
}) => {
    const options = optionsData.map((item) => ({
        value: isFlagDropdown ? item.phoneCode : item,
        label: isFlagDropdown ? `${item.name} (${item.phoneCode})` : item,
        flag: isFlagDropdown ? item.flag : null,
    }));

    const handleChange = (selectedOption) => {
        if (setValue) {
            setValue(inputName, selectedOption.value); 
        } else if (handleInputChange) {
            handleInputChange({
                target: {
                    name: inputName,
                    value: selectedOption.value,
                },
            });
        }
    };

    const customOption = (props) => {
        const { data, innerRef, innerProps } = props;
        return (
            <div ref={innerRef} {...innerProps} className="d-flex align-items-center p-2">
                {isFlagDropdown && data.flag && (
                    <img src={data.flag} alt={data.label} className="dropdown-flag" style={{ width: 20, marginRight: 10 }} />
                )}
                {data.label}
            </div>
        );
    };

    return (
        <div>
            <Select
                options={options}
                onChange={handleChange}
                placeholder={placeholder || "Select an option"}
                value={options.find(opt => opt.value === value) || null}
                className={errors?.[inputName] ? "is-invalid" : ""}
                components={isFlagDropdown ? { Option: customOption } : {}}
                filterOption={(option, inputValue) =>
                    option.data.label.toLowerCase().includes(inputValue.toLowerCase())
                }
            />
            {errors?.[inputName] && <span className="text-danger">{errors[inputName]?.message}</span>}
        </div>
    );
};

export default CustomDropdown;
                


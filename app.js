
"use strict";
//Record Table Loaded.
function loadData() {
    let data = JSON.parse(localStorage.getItem('exist_record'));
    let html = "";
    if (data !== null) {
        if (data.length !== 0) {
            let roll = 1;
            data.forEach(function (value, index) {
                html += ` <tr>
                           <td>${roll++}</td>
                           <td>${value.name}</td>
                           <td>${value.class}</td>
                           <td>${value.gander}</td>
                           <td>${value.number}</td>
                           <td>${value.city}</td>
                           <td><button class="edit" onclick="editData(${index})">Edit</button></td>
                           <td><button class="delete" onclick="deleteData(${index})">Delete</button></td>
                        </tr>`;
            });
        } else {
            html += `<tr><td colspan="8">Record Not Found !!!!</td></tr>`;
        }
    } else {
        html += `<tr><td colspan="8">Record Not Found !!!!</td></tr>`;
    }
    selectElement('tbody').innerHTML = html;
}
loadData();

selectElement("add").addEventListener("click", () => {
    selectElement("add-record-form").style.display = "block";
});

//Close Modal Box
function closeBox() {
    selectElement("close-add-record-form").addEventListener("click", () => {
        selectElement("add-record-form").style.display = "none";
        selectElement("formHandle").reset();
    });
    selectElement("close-edit-record-form").addEventListener("click", () => {
        selectElement("edit-record-form").style.display = "none";
    });
    selectElement("add-record-form").style.display = "none";
    selectElement("edit-record-form").style.display = "none";
    selectElement("formHandle").reset();
};
closeBox();

//form Validate.
function formValidator(valid) {
    if (!valid.value) {
        return false;
    }
    return true;
}

//Get New Record 
selectElement("formHandle").addEventListener("submit", function (e) {
    e.preventDefault();
    let formData = {};
    let isValid = false;
    [...this.elements].forEach(element => {
        if (element.value != "Save") {
            isValid = formValidator(element);
            if (isValid) {
                formData[element.name] = element.value;
            }
        }
    });
    if (isValid) {
        records(formData);
        closeBox();
    }
});

//Save New Record.
function records(data) {
    const exist_record = localStorage.getItem("exist_record");
    let all_record = [];
    if (exist_record !== null) {
        all_record = JSON.parse(exist_record);
    }
    all_record.unshift(data);
    localStorage.setItem('exist_record', JSON.stringify(all_record));
    loadData();
}

//Delete Exist Data.
function deleteData(ind) {
    if (confirm("Are you sure! You wan't to delete this data ?")) {
        const deleteRecord = JSON.parse(localStorage.getItem('exist_record'));
        deleteRecord.splice(ind, 1);
        localStorage.setItem('exist_record', JSON.stringify(deleteRecord));
        loadData();
    }
}

//Edit Form Open.
function editData(e_ind) {
    let editData = JSON.parse(localStorage.getItem('exist_record'));
    let selectData = editData[e_ind];
    let maleSelect = "",
        femaleSelect = "";
    if (selectData.gander == "Male") {
        maleSelect = "selected";
    } else if (selectData.gander == "Female") {
        femaleSelect = "selected";
    }

    const editForm = `<input type="text" name="name" required value="${selectData.name}">
                       <input type="text" name="class" required value="${selectData.class}">
                       <select name="gander" required>
                           <option value="Male" ${maleSelect}>Male</option>
                           <option value="Female" ${femaleSelect}>Female</option>
                       </select>
                       <input type="number" name="number" required value="${selectData.number}">
                       <input type="text" name="city" required value="${selectData.city}">
                       <input type="submit" value="Update">`;
    selectElement("editFormHandle").innerHTML = editForm;
    document.getElementsByClassName("edit-record")[0].style.display = "block";

    //Update Data Form
    selectElement("editFormHandle").addEventListener("submit", function (e) {
        e.preventDefault();
        let isValid = false;
        let updateData = {};
        [...this.elements].forEach(elem => {
            if (elem.value !== "Update") {
                isValid = formValidator(elem);
                if (isValid) {
                    updateData[elem.name] = elem.value;
                }
            }
        });
        if (isValid) {
            editData[e_ind] = updateData;
            localStorage.setItem('exist_record', JSON.stringify(editData));
            closeBox();
            loadData();
        }
    });
}

//Search Data
selectElement("search").addEventListener("keyup", function (res) {
    if (res.target.value !== "") {
        if (res.key === "Enter") {
            let find = res.target.value.toLowerCase();
            let searchResult = JSON.parse(localStorage.getItem('exist_record'));
            let resultStore = "";
            let resultExist = false;
            let sNo = 1;
            for (let match in searchResult) {
                if (searchResult[match].name.toLowerCase() == find || searchResult[match].class.toLowerCase() == find || searchResult[match].gander.toLowerCase() == find || searchResult[match].city.toLowerCase() == find) {
                    resultStore += ` <tr>
                                        <td>${sNo++}</td>
                                        <td>${searchResult[match].name}</td>
                                        <td>${searchResult[match].class}</td>
                                        <td>${searchResult[match].gander}</td>
                                        <td>${searchResult[match].number}</td>
                                        <td>${searchResult[match].city}</td>
                                        <td><button class="edit" onclick="editData(${match})">Edit</button></td>
                                        <td><button class="delete" onclick="deleteData(${match})">Delete</button></td>
                                     </tr>`;
                    resultExist = true;
                }
            }
            if (!resultExist) {
                resultStore += `<tr><td colspan="8">Search Result Not Found !!!!</td></tr>`;
            }
            selectElement('tbody').innerHTML = resultStore;
        }
    } else {
        loadData();
    }
});

//select any element then return
function selectElement(elem) {
    return document.getElementById(elem);
}
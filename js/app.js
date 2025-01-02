(() => {
    "use strict";
    const modules_flsModules = {};
    let _slideUp = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = `${target.offsetHeight}px`;
            target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            window.setTimeout((() => {
                target.hidden = !showmore ? true : false;
                !showmore ? target.style.removeProperty("height") : null;
                target.style.removeProperty("padding-top");
                target.style.removeProperty("padding-bottom");
                target.style.removeProperty("margin-top");
                target.style.removeProperty("margin-bottom");
                !showmore ? target.style.removeProperty("overflow") : null;
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideUpDone", {
                    detail: {
                        target
                    }
                }));
            }), duration);
        }
    };
    let _slideDown = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.hidden = target.hidden ? false : null;
            showmore ? target.style.removeProperty("height") : null;
            let height = target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            target.offsetHeight;
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = height + "px";
            target.style.removeProperty("padding-top");
            target.style.removeProperty("padding-bottom");
            target.style.removeProperty("margin-top");
            target.style.removeProperty("margin-bottom");
            window.setTimeout((() => {
                target.style.removeProperty("height");
                target.style.removeProperty("overflow");
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideDownDone", {
                    detail: {
                        target
                    }
                }));
            }), duration);
        }
    };
    let _slideToggle = (target, duration = 500) => {
        if (target.hidden) return _slideDown(target, duration); else return _slideUp(target, duration);
    };
    let bodyLockStatus = true;
    let bodyLockToggle = (delay = 500) => {
        if (document.documentElement.classList.contains("lock")) bodyUnlock(delay); else bodyLock(delay);
    };
    let bodyUnlock = (delay = 500) => {
        if (bodyLockStatus) {
            const lockPaddingElements = document.querySelectorAll("[data-lp]");
            setTimeout((() => {
                lockPaddingElements.forEach((lockPaddingElement => {
                    lockPaddingElement.style.paddingRight = "";
                }));
                document.body.style.paddingRight = "";
                document.documentElement.classList.remove("lock");
            }), delay);
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    let bodyLock = (delay = 500) => {
        if (bodyLockStatus) {
            const lockPaddingElements = document.querySelectorAll("[data-lp]");
            const lockPaddingValue = window.innerWidth - document.body.offsetWidth + "px";
            lockPaddingElements.forEach((lockPaddingElement => {
                lockPaddingElement.style.paddingRight = lockPaddingValue;
            }));
            document.body.style.paddingRight = lockPaddingValue;
            document.documentElement.classList.add("lock");
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    function menuInit() {
        if (document.querySelector(".icon-menu")) document.addEventListener("click", (function(e) {
            if (bodyLockStatus && e.target.closest(".icon-menu")) {
                bodyLockToggle();
                document.documentElement.classList.toggle("menu-open");
            }
        }));
    }
    function functions_FLS(message) {
        setTimeout((() => {
            if (window.FLS) console.log(message);
        }), 0);
    }
    let formValidate = {
        getErrors(form) {
            let error = 0;
            let formRequiredItems = form.querySelectorAll("*[data-required]");
            if (formRequiredItems.length) formRequiredItems.forEach((formRequiredItem => {
                if ((formRequiredItem.offsetParent !== null || formRequiredItem.tagName === "SELECT") && !formRequiredItem.disabled) error += this.validateInput(formRequiredItem);
            }));
            return error;
        },
        validateInput(formRequiredItem) {
            let error = 0;
            if (formRequiredItem.dataset.required === "email") {
                formRequiredItem.value = formRequiredItem.value.replace(" ", "");
                if (this.emailTest(formRequiredItem)) {
                    this.addError(formRequiredItem);
                    error++;
                } else this.removeError(formRequiredItem);
            } else if (formRequiredItem.type === "checkbox" && !formRequiredItem.checked) {
                this.addError(formRequiredItem);
                error++;
            } else if (!formRequiredItem.value.trim()) {
                this.addError(formRequiredItem);
                error++;
            } else this.removeError(formRequiredItem);
            return error;
        },
        addError(formRequiredItem) {
            formRequiredItem.classList.add("_form-error");
            formRequiredItem.parentElement.classList.add("_form-error");
            let inputError = formRequiredItem.parentElement.querySelector(".form__error");
            if (inputError) formRequiredItem.parentElement.removeChild(inputError);
            if (formRequiredItem.dataset.error) formRequiredItem.parentElement.insertAdjacentHTML("beforeend", `<div class="form__error">${formRequiredItem.dataset.error}</div>`);
        },
        removeError(formRequiredItem) {
            formRequiredItem.classList.remove("_form-error");
            formRequiredItem.parentElement.classList.remove("_form-error");
            if (formRequiredItem.parentElement.querySelector(".form__error")) formRequiredItem.parentElement.removeChild(formRequiredItem.parentElement.querySelector(".form__error"));
        },
        formClean(form) {
            form.reset();
            setTimeout((() => {
                let inputs = form.querySelectorAll("input,textarea");
                for (let index = 0; index < inputs.length; index++) {
                    const el = inputs[index];
                    el.parentElement.classList.remove("_form-focus");
                    el.classList.remove("_form-focus");
                    formValidate.removeError(el);
                }
                let checkboxes = form.querySelectorAll(".checkbox__input");
                if (checkboxes.length > 0) for (let index = 0; index < checkboxes.length; index++) {
                    const checkbox = checkboxes[index];
                    checkbox.checked = false;
                }
                if (modules_flsModules.select) {
                    let selects = form.querySelectorAll("div.select");
                    if (selects.length) for (let index = 0; index < selects.length; index++) {
                        const select = selects[index].querySelector("select");
                        modules_flsModules.select.selectBuild(select);
                    }
                }
            }), 0);
        },
        emailTest(formRequiredItem) {
            return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(formRequiredItem.value);
        }
    };
    class SelectConstructor {
        constructor(props, data = null) {
            let defaultConfig = {
                init: true,
                logging: true,
                speed: 150
            };
            this.config = Object.assign(defaultConfig, props);
            this.selectClasses = {
                classSelect: "select",
                classSelectBody: "select__body",
                classSelectTitle: "select__title",
                classSelectValue: "select__value",
                classSelectLabel: "select__label",
                classSelectInput: "select__input",
                classSelectText: "select__text",
                classSelectLink: "select__link",
                classSelectOptions: "select__options",
                classSelectOptionsScroll: "select__scroll",
                classSelectOption: "select__option",
                classSelectContent: "select__content",
                classSelectRow: "select__row",
                classSelectData: "select__asset",
                classSelectDisabled: "_select-disabled",
                classSelectTag: "_select-tag",
                classSelectOpen: "_select-open",
                classSelectActive: "_select-active",
                classSelectFocus: "_select-focus",
                classSelectMultiple: "_select-multiple",
                classSelectCheckBox: "_select-checkbox",
                classSelectOptionSelected: "_select-selected",
                classSelectPseudoLabel: "_select-pseudo-label"
            };
            this._this = this;
            if (this.config.init) {
                const selectItems = data ? document.querySelectorAll(data) : document.querySelectorAll("select");
                if (selectItems.length) {
                    this.selectsInit(selectItems);
                    this.setLogging(`Прокинувся, построїв селектов: (${selectItems.length})`);
                } else this.setLogging("Сплю, немає жодного select");
            }
        }
        getSelectClass(className) {
            return `.${className}`;
        }
        getSelectElement(selectItem, className) {
            return {
                originalSelect: selectItem.querySelector("select"),
                selectElement: selectItem.querySelector(this.getSelectClass(className))
            };
        }
        selectsInit(selectItems) {
            selectItems.forEach(((originalSelect, index) => {
                this.selectInit(originalSelect, index + 1);
            }));
            document.addEventListener("click", function(e) {
                this.selectsActions(e);
            }.bind(this));
            document.addEventListener("keydown", function(e) {
                this.selectsActions(e);
            }.bind(this));
            document.addEventListener("focusin", function(e) {
                this.selectsActions(e);
            }.bind(this));
            document.addEventListener("focusout", function(e) {
                this.selectsActions(e);
            }.bind(this));
        }
        selectInit(originalSelect, index) {
            const _this = this;
            let selectItem = document.createElement("div");
            selectItem.classList.add(this.selectClasses.classSelect);
            originalSelect.parentNode.insertBefore(selectItem, originalSelect);
            selectItem.appendChild(originalSelect);
            originalSelect.hidden = true;
            index ? originalSelect.dataset.id = index : null;
            if (this.getSelectPlaceholder(originalSelect)) {
                originalSelect.dataset.placeholder = this.getSelectPlaceholder(originalSelect).value;
                if (this.getSelectPlaceholder(originalSelect).label.show) {
                    const selectItemTitle = this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement;
                    selectItemTitle.insertAdjacentHTML("afterbegin", `<span class="${this.selectClasses.classSelectLabel}">${this.getSelectPlaceholder(originalSelect).label.text ? this.getSelectPlaceholder(originalSelect).label.text : this.getSelectPlaceholder(originalSelect).value}</span>`);
                }
            }
            selectItem.insertAdjacentHTML("beforeend", `<div class="${this.selectClasses.classSelectBody}"><div hidden class="${this.selectClasses.classSelectOptions}"></div></div>`);
            this.selectBuild(originalSelect);
            originalSelect.dataset.speed = originalSelect.dataset.speed ? originalSelect.dataset.speed : this.config.speed;
            this.config.speed = +originalSelect.dataset.speed;
            originalSelect.addEventListener("change", (function(e) {
                _this.selectChange(e);
            }));
        }
        selectBuild(originalSelect) {
            const selectItem = originalSelect.parentElement;
            selectItem.dataset.id = originalSelect.dataset.id;
            originalSelect.dataset.classModif ? selectItem.classList.add(`select_${originalSelect.dataset.classModif}`) : null;
            originalSelect.multiple ? selectItem.classList.add(this.selectClasses.classSelectMultiple) : selectItem.classList.remove(this.selectClasses.classSelectMultiple);
            originalSelect.hasAttribute("data-checkbox") && originalSelect.multiple ? selectItem.classList.add(this.selectClasses.classSelectCheckBox) : selectItem.classList.remove(this.selectClasses.classSelectCheckBox);
            this.setSelectTitleValue(selectItem, originalSelect);
            this.setOptions(selectItem, originalSelect);
            originalSelect.hasAttribute("data-search") ? this.searchActions(selectItem) : null;
            originalSelect.hasAttribute("data-open") ? this.selectAction(selectItem) : null;
            this.selectDisabled(selectItem, originalSelect);
        }
        selectsActions(e) {
            const targetElement = e.target;
            const targetType = e.type;
            if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelect)) || targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTag))) {
                const selectItem = targetElement.closest(".select") ? targetElement.closest(".select") : document.querySelector(`.${this.selectClasses.classSelect}[data-id="${targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTag)).dataset.selectId}"]`);
                const originalSelect = this.getSelectElement(selectItem).originalSelect;
                if (targetType === "click") {
                    if (!originalSelect.disabled) if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTag))) {
                        const targetTag = targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTag));
                        const optionItem = document.querySelector(`.${this.selectClasses.classSelect}[data-id="${targetTag.dataset.selectId}"] .select__option[data-value="${targetTag.dataset.value}"]`);
                        this.optionAction(selectItem, originalSelect, optionItem);
                    } else if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTitle))) this.selectAction(selectItem); else if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelectOption))) {
                        const optionItem = targetElement.closest(this.getSelectClass(this.selectClasses.classSelectOption));
                        this.optionAction(selectItem, originalSelect, optionItem);
                    }
                } else if (targetType === "focusin" || targetType === "focusout") {
                    if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelect))) targetType === "focusin" ? selectItem.classList.add(this.selectClasses.classSelectFocus) : selectItem.classList.remove(this.selectClasses.classSelectFocus);
                } else if (targetType === "keydown" && e.code === "Escape") this.selectsСlose();
            } else this.selectsСlose();
        }
        selectsСlose(selectOneGroup) {
            const selectsGroup = selectOneGroup ? selectOneGroup : document;
            const selectActiveItems = selectsGroup.querySelectorAll(`${this.getSelectClass(this.selectClasses.classSelect)}${this.getSelectClass(this.selectClasses.classSelectOpen)}`);
            if (selectActiveItems.length) selectActiveItems.forEach((selectActiveItem => {
                this.selectСlose(selectActiveItem);
            }));
        }
        selectСlose(selectItem) {
            const originalSelect = this.getSelectElement(selectItem).originalSelect;
            const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
            if (!selectOptions.classList.contains("_slide")) {
                selectItem.classList.remove(this.selectClasses.classSelectOpen);
                _slideUp(selectOptions, originalSelect.dataset.speed);
                setTimeout((() => {
                    selectItem.style.zIndex = "";
                }), originalSelect.dataset.speed);
            }
        }
        selectAction(selectItem) {
            const originalSelect = this.getSelectElement(selectItem).originalSelect;
            const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
            const selectOpenzIndex = originalSelect.dataset.zIndex ? originalSelect.dataset.zIndex : 3;
            this.setOptionsPosition(selectItem);
            if (originalSelect.closest("[data-one-select]")) {
                const selectOneGroup = originalSelect.closest("[data-one-select]");
                this.selectsСlose(selectOneGroup);
            }
            setTimeout((() => {
                if (!selectOptions.classList.contains("_slide")) {
                    selectItem.classList.toggle(this.selectClasses.classSelectOpen);
                    _slideToggle(selectOptions, originalSelect.dataset.speed);
                    if (selectItem.classList.contains(this.selectClasses.classSelectOpen)) selectItem.style.zIndex = selectOpenzIndex; else setTimeout((() => {
                        selectItem.style.zIndex = "";
                    }), originalSelect.dataset.speed);
                }
            }), 0);
        }
        setSelectTitleValue(selectItem, originalSelect) {
            const selectItemBody = this.getSelectElement(selectItem, this.selectClasses.classSelectBody).selectElement;
            const selectItemTitle = this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement;
            if (selectItemTitle) selectItemTitle.remove();
            selectItemBody.insertAdjacentHTML("afterbegin", this.getSelectTitleValue(selectItem, originalSelect));
            originalSelect.hasAttribute("data-search") ? this.searchActions(selectItem) : null;
        }
        getSelectTitleValue(selectItem, originalSelect) {
            let selectTitleValue = this.getSelectedOptionsData(originalSelect, 2).html;
            if (originalSelect.multiple && originalSelect.hasAttribute("data-tags")) {
                selectTitleValue = this.getSelectedOptionsData(originalSelect).elements.map((option => `<span role="button" data-select-id="${selectItem.dataset.id}" data-value="${option.value}" class="_select-tag">${this.getSelectElementContent(option)}</span>`)).join("");
                if (originalSelect.dataset.tags && document.querySelector(originalSelect.dataset.tags)) {
                    document.querySelector(originalSelect.dataset.tags).innerHTML = selectTitleValue;
                    if (originalSelect.hasAttribute("data-search")) selectTitleValue = false;
                }
            }
            selectTitleValue = selectTitleValue.length ? selectTitleValue : originalSelect.dataset.placeholder ? originalSelect.dataset.placeholder : "";
            let pseudoAttribute = "";
            let pseudoAttributeClass = "";
            if (originalSelect.hasAttribute("data-pseudo-label")) {
                pseudoAttribute = originalSelect.dataset.pseudoLabel ? ` data-pseudo-label="${originalSelect.dataset.pseudoLabel}"` : ` data-pseudo-label="Заповніть атрибут"`;
                pseudoAttributeClass = ` ${this.selectClasses.classSelectPseudoLabel}`;
            }
            this.getSelectedOptionsData(originalSelect).values.length ? selectItem.classList.add(this.selectClasses.classSelectActive) : selectItem.classList.remove(this.selectClasses.classSelectActive);
            if (originalSelect.hasAttribute("data-search")) return `<div class="${this.selectClasses.classSelectTitle}"><span${pseudoAttribute} class="${this.selectClasses.classSelectValue}"><input autocomplete="off" type="text" placeholder="${selectTitleValue}" data-placeholder="${selectTitleValue}" class="${this.selectClasses.classSelectInput}"></span></div>`; else {
                const customClass = this.getSelectedOptionsData(originalSelect).elements.length && this.getSelectedOptionsData(originalSelect).elements[0].dataset.class ? ` ${this.getSelectedOptionsData(originalSelect).elements[0].dataset.class}` : "";
                return `<button type="button" class="${this.selectClasses.classSelectTitle}"><span${pseudoAttribute} class="${this.selectClasses.classSelectValue}${pseudoAttributeClass}"><span class="${this.selectClasses.classSelectContent}${customClass}">${selectTitleValue}</span></span></button>`;
            }
        }
        getSelectElementContent(selectOption) {
            const selectOptionData = selectOption.dataset.asset ? `${selectOption.dataset.asset}` : "";
            const selectOptionDataHTML = selectOptionData.indexOf("img") >= 0 ? `<img src="${selectOptionData}" alt="">` : selectOptionData;
            let selectOptionContentHTML = ``;
            selectOptionContentHTML += selectOptionData ? `<span class="${this.selectClasses.classSelectRow}">` : "";
            selectOptionContentHTML += selectOptionData ? `<span class="${this.selectClasses.classSelectData}">` : "";
            selectOptionContentHTML += selectOptionData ? selectOptionDataHTML : "";
            selectOptionContentHTML += selectOptionData ? `</span>` : "";
            selectOptionContentHTML += selectOptionData ? `<span class="${this.selectClasses.classSelectText}">` : "";
            selectOptionContentHTML += selectOption.textContent;
            selectOptionContentHTML += selectOptionData ? `</span>` : "";
            selectOptionContentHTML += selectOptionData ? `</span>` : "";
            return selectOptionContentHTML;
        }
        getSelectPlaceholder(originalSelect) {
            const selectPlaceholder = Array.from(originalSelect.options).find((option => !option.value));
            if (selectPlaceholder) return {
                value: selectPlaceholder.textContent,
                show: selectPlaceholder.hasAttribute("data-show"),
                label: {
                    show: selectPlaceholder.hasAttribute("data-label"),
                    text: selectPlaceholder.dataset.label
                }
            };
        }
        getSelectedOptionsData(originalSelect, type) {
            let selectedOptions = [];
            if (originalSelect.multiple) selectedOptions = Array.from(originalSelect.options).filter((option => option.value)).filter((option => option.selected)); else selectedOptions.push(originalSelect.options[originalSelect.selectedIndex]);
            return {
                elements: selectedOptions.map((option => option)),
                values: selectedOptions.filter((option => option.value)).map((option => option.value)),
                html: selectedOptions.map((option => this.getSelectElementContent(option)))
            };
        }
        getOptions(originalSelect) {
            const selectOptionsScroll = originalSelect.hasAttribute("data-scroll") ? `data-simplebar` : "";
            const customMaxHeightValue = +originalSelect.dataset.scroll ? +originalSelect.dataset.scroll : null;
            let selectOptions = Array.from(originalSelect.options);
            if (selectOptions.length > 0) {
                let selectOptionsHTML = ``;
                if (this.getSelectPlaceholder(originalSelect) && !this.getSelectPlaceholder(originalSelect).show || originalSelect.multiple) selectOptions = selectOptions.filter((option => option.value));
                selectOptionsHTML += `<div ${selectOptionsScroll} ${selectOptionsScroll ? `style="max-height: ${customMaxHeightValue}px"` : ""} class="${this.selectClasses.classSelectOptionsScroll}">`;
                selectOptions.forEach((selectOption => {
                    selectOptionsHTML += this.getOption(selectOption, originalSelect);
                }));
                selectOptionsHTML += `</div>`;
                return selectOptionsHTML;
            }
        }
        getOption(selectOption, originalSelect) {
            const selectOptionSelected = selectOption.selected && originalSelect.multiple ? ` ${this.selectClasses.classSelectOptionSelected}` : "";
            const selectOptionHide = selectOption.selected && !originalSelect.hasAttribute("data-show-selected") && !originalSelect.multiple ? `hidden` : ``;
            const selectOptionClass = selectOption.dataset.class ? ` ${selectOption.dataset.class}` : "";
            const selectOptionLink = selectOption.dataset.href ? selectOption.dataset.href : false;
            const selectOptionLinkTarget = selectOption.hasAttribute("data-href-blank") ? `target="_blank"` : "";
            let selectOptionHTML = ``;
            selectOptionHTML += selectOptionLink ? `<a ${selectOptionLinkTarget} ${selectOptionHide} href="${selectOptionLink}" data-value="${selectOption.value}" class="${this.selectClasses.classSelectOption}${selectOptionClass}${selectOptionSelected}">` : `<button ${selectOptionHide} class="${this.selectClasses.classSelectOption}${selectOptionClass}${selectOptionSelected}" data-value="${selectOption.value}" type="button">`;
            selectOptionHTML += this.getSelectElementContent(selectOption);
            selectOptionHTML += selectOptionLink ? `</a>` : `</button>`;
            return selectOptionHTML;
        }
        setOptions(selectItem, originalSelect) {
            const selectItemOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
            selectItemOptions.innerHTML = this.getOptions(originalSelect);
        }
        setOptionsPosition(selectItem) {
            const originalSelect = this.getSelectElement(selectItem).originalSelect;
            const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
            const selectItemScroll = this.getSelectElement(selectItem, this.selectClasses.classSelectOptionsScroll).selectElement;
            const customMaxHeightValue = +originalSelect.dataset.scroll ? `${+originalSelect.dataset.scroll}px` : ``;
            const selectOptionsPosMargin = +originalSelect.dataset.optionsMargin ? +originalSelect.dataset.optionsMargin : 10;
            if (!selectItem.classList.contains(this.selectClasses.classSelectOpen)) {
                selectOptions.hidden = false;
                const selectItemScrollHeight = selectItemScroll.offsetHeight ? selectItemScroll.offsetHeight : parseInt(window.getComputedStyle(selectItemScroll).getPropertyValue("max-height"));
                const selectOptionsHeight = selectOptions.offsetHeight > selectItemScrollHeight ? selectOptions.offsetHeight : selectItemScrollHeight + selectOptions.offsetHeight;
                const selectOptionsScrollHeight = selectOptionsHeight - selectItemScrollHeight;
                selectOptions.hidden = true;
                const selectItemHeight = selectItem.offsetHeight;
                const selectItemPos = selectItem.getBoundingClientRect().top;
                const selectItemTotal = selectItemPos + selectOptionsHeight + selectItemHeight + selectOptionsScrollHeight;
                const selectItemResult = window.innerHeight - (selectItemTotal + selectOptionsPosMargin);
                if (selectItemResult < 0) {
                    const newMaxHeightValue = selectOptionsHeight + selectItemResult;
                    if (newMaxHeightValue < 100) {
                        selectItem.classList.add("select--show-top");
                        selectItemScroll.style.maxHeight = selectItemPos < selectOptionsHeight ? `${selectItemPos - (selectOptionsHeight - selectItemPos)}px` : customMaxHeightValue;
                    } else {
                        selectItem.classList.remove("select--show-top");
                        selectItemScroll.style.maxHeight = `${newMaxHeightValue}px`;
                    }
                }
            } else setTimeout((() => {
                selectItem.classList.remove("select--show-top");
                selectItemScroll.style.maxHeight = customMaxHeightValue;
            }), +originalSelect.dataset.speed);
        }
        optionAction(selectItem, originalSelect, optionItem) {
            const selectOptions = selectItem.querySelector(`${this.getSelectClass(this.selectClasses.classSelectOptions)}`);
            if (!selectOptions.classList.contains("_slide")) {
                if (originalSelect.multiple) {
                    optionItem.classList.toggle(this.selectClasses.classSelectOptionSelected);
                    const originalSelectSelectedItems = this.getSelectedOptionsData(originalSelect).elements;
                    originalSelectSelectedItems.forEach((originalSelectSelectedItem => {
                        originalSelectSelectedItem.removeAttribute("selected");
                    }));
                    const selectSelectedItems = selectItem.querySelectorAll(this.getSelectClass(this.selectClasses.classSelectOptionSelected));
                    selectSelectedItems.forEach((selectSelectedItems => {
                        originalSelect.querySelector(`option[value = "${selectSelectedItems.dataset.value}"]`).setAttribute("selected", "selected");
                    }));
                } else {
                    if (!originalSelect.hasAttribute("data-show-selected")) setTimeout((() => {
                        if (selectItem.querySelector(`${this.getSelectClass(this.selectClasses.classSelectOption)}[hidden]`)) selectItem.querySelector(`${this.getSelectClass(this.selectClasses.classSelectOption)}[hidden]`).hidden = false;
                        optionItem.hidden = true;
                    }), this.config.speed);
                    originalSelect.value = optionItem.hasAttribute("data-value") ? optionItem.dataset.value : optionItem.textContent;
                    this.selectAction(selectItem);
                }
                this.setSelectTitleValue(selectItem, originalSelect);
                this.setSelectChange(originalSelect);
            }
        }
        selectChange(e) {
            const originalSelect = e.target;
            this.selectBuild(originalSelect);
            this.setSelectChange(originalSelect);
        }
        setSelectChange(originalSelect) {
            if (originalSelect.hasAttribute("data-validate")) formValidate.validateInput(originalSelect);
            if (originalSelect.hasAttribute("data-submit") && originalSelect.value) {
                let tempButton = document.createElement("button");
                tempButton.type = "submit";
                originalSelect.closest("form").append(tempButton);
                tempButton.click();
                tempButton.remove();
            }
            const selectItem = originalSelect.parentElement;
            this.selectCallback(selectItem, originalSelect);
        }
        selectDisabled(selectItem, originalSelect) {
            if (originalSelect.disabled) {
                selectItem.classList.add(this.selectClasses.classSelectDisabled);
                this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement.disabled = true;
            } else {
                selectItem.classList.remove(this.selectClasses.classSelectDisabled);
                this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement.disabled = false;
            }
        }
        searchActions(selectItem) {
            this.getSelectElement(selectItem).originalSelect;
            const selectInput = this.getSelectElement(selectItem, this.selectClasses.classSelectInput).selectElement;
            const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
            const selectOptionsItems = selectOptions.querySelectorAll(`.${this.selectClasses.classSelectOption} `);
            const _this = this;
            selectInput.addEventListener("input", (function() {
                selectOptionsItems.forEach((selectOptionsItem => {
                    if (selectOptionsItem.textContent.toUpperCase().includes(selectInput.value.toUpperCase())) selectOptionsItem.hidden = false; else selectOptionsItem.hidden = true;
                }));
                selectOptions.hidden === true ? _this.selectAction(selectItem) : null;
            }));
        }
        selectCallback(selectItem, originalSelect) {
            document.dispatchEvent(new CustomEvent("selectCallback", {
                detail: {
                    select: originalSelect
                }
            }));
        }
        setLogging(message) {
            this.config.logging ? functions_FLS(`[select]: ${message} `) : null;
        }
    }
    modules_flsModules.select = new SelectConstructor({});
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    class DynamicAdapt {
        constructor(type) {
            this.type = type;
        }
        init() {
            this.оbjects = [];
            this.daClassname = "_dynamic_adapt_";
            this.nodes = [ ...document.querySelectorAll("[data-da]") ];
            this.nodes.forEach((node => {
                const data = node.dataset.da.trim();
                const dataArray = data.split(",");
                const оbject = {};
                оbject.element = node;
                оbject.parent = node.parentNode;
                оbject.destination = document.querySelector(`${dataArray[0].trim()}`);
                оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767.98";
                оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
                оbject.index = this.indexInParent(оbject.parent, оbject.element);
                this.оbjects.push(оbject);
            }));
            this.arraySort(this.оbjects);
            this.mediaQueries = this.оbjects.map((({breakpoint}) => `(${this.type}-width: ${breakpoint / 16}em),${breakpoint}`)).filter(((item, index, self) => self.indexOf(item) === index));
            this.mediaQueries.forEach((media => {
                const mediaSplit = media.split(",");
                const matchMedia = window.matchMedia(mediaSplit[0]);
                const mediaBreakpoint = mediaSplit[1];
                const оbjectsFilter = this.оbjects.filter((({breakpoint}) => breakpoint === mediaBreakpoint));
                matchMedia.addEventListener("change", (() => {
                    this.mediaHandler(matchMedia, оbjectsFilter);
                }));
                this.mediaHandler(matchMedia, оbjectsFilter);
            }));
        }
        mediaHandler(matchMedia, оbjects) {
            if (matchMedia.matches) оbjects.forEach((оbject => {
                this.moveTo(оbject.place, оbject.element, оbject.destination);
            })); else оbjects.forEach((({parent, element, index}) => {
                if (element.classList.contains(this.daClassname)) this.moveBack(parent, element, index);
            }));
        }
        moveTo(place, element, destination) {
            element.classList.add(this.daClassname);
            if (place === "last" || place >= destination.children.length) {
                destination.append(element);
                return;
            }
            if (place === "first") {
                destination.prepend(element);
                return;
            }
            destination.children[place].before(element);
        }
        moveBack(parent, element, index) {
            element.classList.remove(this.daClassname);
            if (parent.children[index] !== void 0) parent.children[index].before(element); else parent.append(element);
        }
        indexInParent(parent, element) {
            return [ ...parent.children ].indexOf(element);
        }
        arraySort(arr) {
            if (this.type === "min") arr.sort(((a, b) => {
                if (a.breakpoint === b.breakpoint) {
                    if (a.place === b.place) return 0;
                    if (a.place === "first" || b.place === "last") return -1;
                    if (a.place === "last" || b.place === "first") return 1;
                    return 0;
                }
                return a.breakpoint - b.breakpoint;
            })); else {
                arr.sort(((a, b) => {
                    if (a.breakpoint === b.breakpoint) {
                        if (a.place === b.place) return 0;
                        if (a.place === "first" || b.place === "last") return 1;
                        if (a.place === "last" || b.place === "first") return -1;
                        return 0;
                    }
                    return b.breakpoint - a.breakpoint;
                }));
                return;
            }
        }
    }
    const da = new DynamicAdapt("max");
    da.init();
    window.onload = () => {
        const [currentPage] = location.pathname.split("/").slice(-1);
        const menuLinks = document.querySelectorAll(".menu__link");
        if (menuLinks.length) menuLinks.forEach((menuLink => {
            if (menuLink.getAttribute("href") === currentPage) menuLink.classList.add("_active-page");
        }));
    };
    let center = [ 55.661862, 37.546561 ];
    function init() {
        let map = new ymaps.Map("map", {
            center,
            zoom: 17
        });
        map.options.set("customMapOptions", {
            fillColor: "rgba(33, 22, 4, 0.80)"
        });
        function getMarkerSize() {
            let width = window.innerWidth;
            if (width >= 1680) return [ 62, 77 ]; else if (width >= 992) return [ 52, 65 ]; else if (width >= 768) return [ 42, 52 ]; else return [ 37, 46 ];
        }
        let placemark = new ymaps.Placemark(center, {
            balloonContent: `\n\t<div class="balloon balloon--location">\n\t<div class="balloon__location-comp">\n\t\t<div class="balloon__inner-address">\n\n\t\t\t<div class="balloon__main-contact">\n\t\t\t\t<h3 class="balloon__title-contact">Контакты</h3>\n\n\t\t\t\t<div class="balloon__links">\n\n\t\t\t\t\t<div class="balloon__elem-not-location">\n\t\t\t\t\t\t<svg class="balloon__marker-address" data-name="layer-address" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 31">\n\t\t\t\t\t\t\t<g>\n\t\t\t\t\t\t\t\t<path d="M12.5,0C5.61,0,0,5.56,0,12.39c-.05,9.99,12.02,18.27,12.5,18.61,0,0,12.55-8.62,12.5-18.6C25,5.56,19.39,0,12.5,0ZM12.5,18.6c-3.45,0-6.25-2.77-6.25-6.2s2.8-6.2,6.25-6.2,6.25,2.77,6.25,6.2-2.8,6.2-6.25,6.2Z" />\n\t\t\t\t\t\t\t</g>\n\t\t\t\t\t\t</svg>\n\t\t\t\t\t\t117420 Россия, г. Москва, ул. Профсоюзная д.57 БЦ «НИИПолиграфмаш»\n\t\t\t\t\t</div>\n\n\t\t\t\t\t<a href="tel:79671240303" target="_blank" class="balloon__elem-location elem-location">\n\t\t\t\t\t\t<svg class="elem-location__marker" data-name="layer" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22">\n\t\t\t\t\t\t\t<g>\n\t\t\t\t\t\t\t\t<path d="M19.84,15l-3.11-.36c-.37-.04-.74,0-1.08.12-.35.12-.66.32-.92.58l-2.25,2.25c-3.48-1.77-6.3-4.59-8.07-8.07l2.27-2.27c.53-.53.78-1.26.7-2.01l-.36-3.09c-.07-.6-.36-1.15-.81-1.55C5.75.22,5.17,0,4.57,0h-2.12C1.07,0-.08,1.15,0,2.54c.65,10.46,9.01,18.81,19.46,19.46,1.38.09,2.54-1.07,2.54-2.45v-2.12c.01-1.24-.92-2.28-2.16-2.42Z" />\n\t\t\t\t\t\t\t</g>\n\t\t\t\t\t\t</svg>\n\t\t\t\t\t\t+7 (967) 124-03-03\n\t\t\t\t\t</a>\n\n\t\t\t\t\t<div class="balloon__inner-tel">\n\t\t\t\t\t\t<a href="tel:88002222903" target="_blank" class="balloon__elem-location elem-location">\n\t\t\t\t\t\t\t<svg class="elem-location__marker" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22">\n\t\t\t\t\t\t\t\t<g>\n\t\t\t\t\t\t\t\t\t<path d="M19.84,15l-3.11-.36c-.37-.04-.74,0-1.08.12-.35.12-.66.32-.92.58l-2.25,2.25c-3.48-1.77-6.3-4.59-8.07-8.07l2.27-2.27c.53-.53.78-1.26.7-2.01l-.36-3.09c-.07-.6-.36-1.15-.81-1.55C5.75.22,5.17,0,4.57,0h-2.12C1.07,0-.08,1.15,0,2.54c.65,10.46,9.01,18.81,19.46,19.46,1.38.09,2.54-1.07,2.54-2.45v-2.12c.01-1.24-.92-2.28-2.16-2.42Z" />\n\t\t\t\t\t\t\t\t</g>\n\t\t\t\t\t\t\t</svg>8 (800) 222-29-03\n\t\t\t\t\t\t</a>\n\t\t\t\t\t\t<span>Бесплатно по всей России</span>\n\t\t\t\t\t</div>\n\n\t\t\t\t\t<a href="https://www.dubinin-partner.com" target="_blank" class="balloon__elem-location elem-location">\n\t\t\t\t\t\t<svg class="elem-location__marker" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 21">\n\t\t\t\t\t\t\t<g>\n\t\t\t\t\t\t\t\t<path d="M10.5,0c-2.78,0-5.46,1.11-7.42,3.08C1.11,5.04,0,7.72,0,10.5s1.11,5.46,3.08,7.42c1.97,1.97,4.64,3.08,7.42,3.08s5.46-1.11,7.42-3.08c1.97-1.97,3.08-4.64,3.08-7.42s-1.11-5.46-3.08-7.42c-1.97-1.97-4.64-3.08-7.42-3.08ZM1.29,11.29h2.93c.05,1.06.19,2.12.44,3.15h-2.52c-.47-.99-.76-2.06-.85-3.15ZM11.29,4.99V1.39c1.12.43,2.05,1.26,2.59,2.33.24.41.45.83.63,1.26h-3.22ZM15.05,6.57c.27,1.03.43,2.09.48,3.15h-4.24v-3.15h3.76ZM9.71,1.39v3.61h-3.22c.18-.43.39-.86.63-1.26.54-1.08,1.46-1.91,2.59-2.35ZM9.71,6.57v3.15h-4.22c.05-1.06.21-2.12.48-3.15h3.74ZM4.22,9.71H1.29c.09-1.09.38-2.16.85-3.15h2.52c-.25,1.03-.4,2.09-.44,3.15ZM5.48,11.29h4.22v3.15h-3.74c-.27-1.03-.43-2.09-.48-3.15ZM9.72,15.96v3.61c-1.12-.43-2.05-1.26-2.59-2.33-.24-.4-.45-.83-.63-1.26h3.22ZM11.29,19.57v-3.55h3.22c-.18.43-.39.86-.63,1.26-.54,1.07-1.47,1.91-2.59,2.33v-.05ZM11.29,14.39v-3.15h4.22c-.05,1.06-.21,2.12-.48,3.15h-3.74ZM16.79,11.23h2.93c-.09,1.09-.38,2.16-.85,3.15h-2.53c.25-1.02.39-2.05.44-3.09v-.06ZM16.79,9.66c-.05-1.04-.2-2.08-.45-3.09h2.52c.47.99.76,2.06.85,3.15l-2.92-.06ZM17.95,4.99h-2.09c-.38-1.06-.93-2.05-1.62-2.94,1.45.65,2.71,1.66,3.66,2.94h.05ZM6.76,2.05c-.7.89-1.24,1.88-1.62,2.94h-2.04c.95-1.28,2.21-2.29,3.66-2.94ZM3.08,16.05h2.05c.38,1.06.93,2.05,1.62,2.94-1.46-.66-2.72-1.69-3.66-2.98v.04ZM14.23,18.99c.7-.89,1.24-1.88,1.62-2.94h2.05c-.96,1.26-2.22,2.25-3.66,2.89v.05Z" />\n\t\t\t\t\t\t\t</g>\n\t\t\t\t\t\t</svg>\n\t\t\t\t\t\tdubinin-partner.com\n\t\t\t\t\t</a>\n\n\t\t\t\t\t<a href="mailto:dubinin_partners@bk.ru" target="_blank" class="balloon__elem-location elem-location">\n\t\t\t\t\t\t<svg class="elem-location__marker" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 18.33">\n\t\t\t\t\t\t\t<g>\n\t\t\t\t\t\t\t\t<path d="M22.02.98c-.63-.63-1.47-.98-2.36-.98H3.33c-.88,0-1.73.35-2.36.98s-.98,1.47-.98,2.36v11.67c0,.88.35,1.73.98,2.36.63.63,1.47.98,2.36.98h16.33c.88,0,1.73-.35,2.36-.98.63-.63.98-1.47.98-2.36V3.33c0-.88-.35-1.73-.98-2.36ZM2.39,2.39c.25-.25.59-.39.94-.39h16.33c.35,0,.69.14.94.39.25.25.39.59.39.94v.72l-9.5,6.33L2,4.05v-.72c0-.35.14-.69.39-.94ZM20.61,15.94c-.25.25-.59.39-.94.39H3.33c-.35,0-.69-.14-.94-.39-.25-.25-.39-.59-.39-.94V6.46l8.95,5.96c.34.22.77.22,1.11,0l8.95-5.96v8.54c0,.35-.14.69-.39.94Z" />\n\t\t\t\t\t\t\t</g>\n\t\t\t\t\t\t</svg>\n\t\t\t\t\t\tdubinin_partners@bk.ru\n\t\t\t\t\t</a>\n\t\t\t\t</div>\n\n\t\t\t</div>\n\n\t\t\t<div class="balloon__social-group-icons">\n\t\t\t\t<a href="#" target="_blank" title="Telegram" class="balloon__link-jump">\n\t\t\t\t\t<svg class="balloon__icon-pic" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" fill="none">\n\t\t\t\t\t\t<rect x="0.5" y="0.5" width="51" height="51" rx="4.5" stroke="white" />\n\t\t\t\t\t\t<path fill-rule="evenodd" clip-rule="evenodd" d="M33.0169 18.1175C33.264 18.0135 33.5345 17.9776 33.8002 18.0136C34.0659 18.0496 34.317 18.1561 34.5276 18.3222C34.7381 18.4882 34.9003 18.7076 34.9973 18.9575C35.0942 19.2075 35.1224 19.4789 35.0789 19.7435L32.8109 33.5005C32.5909 34.8275 31.1349 35.5885 29.9179 34.9275C28.8999 34.3745 27.3879 33.5225 26.0279 32.6335C25.3479 32.1885 23.2649 30.7635 23.5209 29.7495C23.7409 28.8825 27.2409 25.6245 29.2409 23.6875C30.0259 22.9265 29.6679 22.4875 28.7409 23.1875C26.4389 24.9255 22.7429 27.5685 21.5209 28.3125C20.4429 28.9685 19.8809 29.0805 19.2089 28.9685C17.9829 28.7645 16.8459 28.4485 15.9179 28.0635C14.6639 27.5435 14.7249 25.8195 15.9169 25.3175L33.0169 18.1175Z" fill="white" />\n\t\t\t\t\t</svg>\n\t\t\t\t</a>\n\n\t\t\t\t<a href="#" target="_blank" title="WhatsApp" class="balloon__link-jump">\n\t\t\t\t\t<svg class="balloon__icon-pic" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" fill="none">\n\t\t\t\t\t\t<rect x="0.5" y="0.5" width="51" height="51" rx="4.5" stroke="white" />\n\t\t\t\t\t\t<mask style="mask-type:luminance" maskUnits="userSpaceOnUse" x="17" y="16" width="19" height="19">\n\t\t\t\t\t\t\t<path d="M17 16H36V35H17V16Z" fill="white" />\n\t\t\t\t\t\t</mask>\n\t\t\t\t\t\t<g mask="url(#mask0_1_771)">\n\t\t\t\t\t\t\t<path d="M28.29 16.14L27.72 16.06C26.0069 15.8127 24.2588 16.0574 22.6795 16.7656C21.1002 17.4738 19.7548 18.6163 18.8 20.06C17.7842 21.44 17.1786 23.0788 17.053 24.7877C16.9274 26.4967 17.2868 28.2063 18.09 29.72C18.1722 29.8717 18.2234 30.0383 18.2405 30.21C18.2577 30.3817 18.2405 30.555 18.19 30.72C17.78 32.13 17.4 33.55 17 35.04L17.5 34.89C18.85 34.53 20.2 34.17 21.55 33.84C21.8349 33.7808 22.1311 33.8087 22.4 33.92C23.6112 34.5111 24.9348 34.8363 26.282 34.8738C27.6293 34.9113 28.9689 34.6601 30.2111 34.1372C31.4533 33.6144 32.5692 32.8318 33.4841 31.8421C34.399 30.8525 35.0915 29.6785 35.5153 28.3992C35.9392 27.1198 36.0844 25.7646 35.9414 24.4244C35.7983 23.0843 35.3703 21.7903 34.6859 20.6292C34.0016 19.4681 33.0769 18.4668 31.9737 17.6925C30.8706 16.9183 29.6146 16.3889 28.29 16.14ZM30.81 29.26C30.4466 29.5854 30.0034 29.8087 29.5256 29.907C29.0478 30.0054 28.5524 29.9754 28.09 29.82C25.9949 29.2292 24.1772 27.9146 22.96 26.11C22.4952 25.4716 22.1216 24.7715 21.85 24.03C21.7029 23.5998 21.6763 23.1375 21.7733 22.6933C21.8702 22.249 22.087 21.8398 22.4 21.51C22.5524 21.3155 22.7598 21.1714 22.9953 21.0965C23.2307 21.0216 23.4832 21.0194 23.72 21.09C23.92 21.14 24.06 21.43 24.24 21.65C24.3867 22.0634 24.5567 22.4667 24.75 22.86C24.8964 23.0605 24.9576 23.3108 24.9201 23.5563C24.8826 23.8017 24.7496 24.0223 24.55 24.17C24.1 24.57 24.17 24.9 24.49 25.35C25.1971 26.3695 26.1733 27.1727 27.31 27.67C27.63 27.81 27.87 27.84 28.08 27.51C28.17 27.38 28.29 27.27 28.39 27.15C28.97 26.42 28.79 26.43 29.71 26.83C30.0033 26.9534 30.2867 27.0967 30.56 27.26C30.83 27.42 31.24 27.59 31.3 27.83C31.3577 28.0904 31.3425 28.3616 31.2561 28.6139C31.1696 28.8662 31.0153 29.0898 30.81 29.26Z" fill="white" />\n\t\t\t\t\t\t</g>\n\t\t\t\t\t</svg>\n\t\t\t\t</a>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</div>\n\t\t\t`
        }, {
            iconLayout: "default#image",
            iconImageHref: "../img/items_svg/marker_icon.svg",
            iconImageSize: getMarkerSize(),
            iconImageOffset: [ -20, -110 ]
        });
        function updateMarkerSize() {
            let newSize = getMarkerSize();
            placemark.options.set("iconImageSize", newSize);
        }
        window.addEventListener("resize", updateMarkerSize);
        map.controls.remove("geolocationControl");
        map.controls.remove("searchControl");
        map.controls.remove("trafficControl");
        map.controls.remove("typeSelector");
        map.controls.remove("fullscreenControl");
        map.controls.remove("zoomControl");
        map.controls.remove("rulerControl");
        map.behaviors.disable([ "scrollZoom" ]);
        map.geoObjects.add(placemark);
    }
    ymaps.ready(init);
    document.addEventListener("DOMContentLoaded", (function() {
        const itemsToShow = 0;
        const itemsToShowOnClick = 100;
        const toggleResolution = 768;
        const showMoreBlocks = document.querySelectorAll(".show-more");
        showMoreBlocks.forEach((block => {
            const container = block.querySelector(".block__content");
            const showMoreBtn = block.querySelector(".block__more");
            const caption = block.querySelector(".show-more__caption");
            if (!container || !showMoreBtn || !caption) return;
            const itemArea = Array.from(container.children);
            if (itemArea.length === 0) {
                showMoreBtn.classList.add("hidden");
                return;
            }
            let itemsShown = itemsToShow;
            let isExpanded = false;
            function interpolateMarginBottom(screenWidth) {
                const maxWidth = 768;
                const minWidth = 360;
                const maxMargin = 83;
                const minMargin = 47;
                const clampedWidth = Math.max(Math.min(screenWidth, maxWidth), minWidth);
                return minMargin + (maxMargin - minMargin) * (clampedWidth - minWidth) / (maxWidth - minWidth);
            }
            function initializeItems() {
                if (window.innerWidth > toggleResolution) {
                    itemsShown = itemArea.length;
                    isExpanded = true;
                    showMoreBtn.classList.add("hidden");
                    caption.style.marginBottom = "";
                } else {
                    itemsShown = itemsToShow;
                    isExpanded = false;
                    showMoreBtn.classList.toggle("hidden", itemArea.length <= itemsToShow);
                    updateCaptionMargin();
                }
                toggleItems();
            }
            function toggleItems() {
                itemArea.forEach(((item, index) => {
                    item.style.display = index < itemsShown ? "block" : "none";
                }));
                updateButtonText();
            }
            function updateButtonText() {
                showMoreBtn.textContent = isExpanded ? "Свернуть" : "Подробнее";
                showMoreBtn.classList.toggle("block__more--expanded", isExpanded);
                updateCaptionMargin();
            }
            function updateCaptionMargin() {
                if (window.innerWidth <= toggleResolution) {
                    const dynamicMarginBottom = interpolateMarginBottom(window.innerWidth);
                    caption.style.marginBottom = `${dynamicMarginBottom}px`;
                } else caption.style.marginBottom = "";
            }
            showMoreBtn.addEventListener("click", (function() {
                if (isExpanded) {
                    itemsShown = itemsToShow;
                    isExpanded = false;
                } else {
                    itemsShown = Math.min(itemsShown + itemsToShowOnClick, itemArea.length);
                    isExpanded = itemsShown === itemArea.length;
                }
                toggleItems();
            }));
            function handleResize() {
                if (window.innerWidth > toggleResolution) {
                    itemsShown = itemArea.length;
                    isExpanded = true;
                    showMoreBtn.classList.add("hidden");
                    caption.style.marginBottom = "";
                } else {
                    itemsShown = itemsToShow;
                    isExpanded = false;
                    showMoreBtn.classList.toggle("hidden", itemArea.length <= itemsToShow);
                    updateCaptionMargin();
                }
                toggleItems();
            }
            initializeItems();
            window.addEventListener("resize", handleResize);
        }));
    }));
    window["FLS"] = false;
    menuInit();
})();
import {Store} from "./index.js";
import {TFormState} from "@/types/store/formStore.ts";

const initialState: TFormState = {name: '', surname: '', age: '', city: ''};

class FormStore extends Store<TFormState> {

    handleChange(name: string, value: string) {
        this.state.next({
            ...this.state.value,
            [name]: value,
        });
    }
}

export const formStore = new FormStore(initialState);

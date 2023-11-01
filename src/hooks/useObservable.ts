import {useRef} from "react";
import {BehaviorSubject} from "rxjs";

const useObservable = <T>(state:T) => {
    const observableRef = useRef(new BehaviorSubject<T>(state));

    const handleNext = (state:T) => {
        observableRef.current.next(state);
    };

    return [observableRef.current, handleNext];
};

export default useObservable;

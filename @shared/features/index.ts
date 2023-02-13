const VALUE_REJECTED = 1000;

export const Feature = {
    'C0001': (
        transaction
    ) => {
        if (transaction.value > VALUE_REJECTED) {
            return false;
        }
        return true;
    }
}
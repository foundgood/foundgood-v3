export default async (req, res) => {
    const { body } = req;

    let user = body.user;

    const admins = ['0051t000000OHTrAAO'];

    if (admins.includes(user.user_id)) {
        user.User_Account_Type__c = 'Super';
    }

    try {
        res.status(200).json(user);

        return;
    } catch (error) {
        // Otherwise fail
        res.status(400).json(error);
        return;
    }
};

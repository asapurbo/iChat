
const usePartnerEmail = ({item,email}) => {
    const { users } = item ?? {}
    const partner = users.find(item => item.email !== email)
    return partner;
}

export default usePartnerEmail
/**
 * Shared open-state for the contact dialog so any trigger (header menu, gateway
 * page, …) can pop it open. The dialog itself is mounted once in the layout.
 */
export const useContact = () => {
    const open = useState('contact-open', () => false)
    return {
        open,
        openContact: () => { open.value = true },
        closeContact: () => { open.value = false },
    }
}

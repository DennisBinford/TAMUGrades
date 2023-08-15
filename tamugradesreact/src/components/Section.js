function Section(props) {
    return (
        <table class="hover:table-fixed">
            <tbody>
                <tr>
                <td>{props.department}</td>
                <td>{props.course}</td>
                <td>{props.section}</td>
                <td>{props.professor}</td>
                </tr>
            </tbody>
        </table>)
}

export default Section;
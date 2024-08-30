import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';

export default function DownloadImageIcon(props: any) {
    return (
        <i
            className="fa-solid fa-image icon"
            onClick={async () => {
                if (props.tableRef.current) {
                    const canvas = await html2canvas(props.tableRef.current);
                    canvas.toBlob((blob) => {
                        if (blob) saveAs(blob, 'screenshot.png');
                    });
                }
            }}
        ></i>
    );
}
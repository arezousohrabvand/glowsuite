import Button from "../ui/Button";

export default function ServiceCard({ service }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-4">
      <h3 className="text-lg font-semibold">{service.name}</h3>
      <p className="text-gray-500">{service.description}</p>
      <p className="mt-2 font-medium">${service.price}</p>
      <p className="text-sm text-gray-400">{service.duration} mins</p>
      <Button className="mt-4">Book Now</Button>
    </div>
  );
}
